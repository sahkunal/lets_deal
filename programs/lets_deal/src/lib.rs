use anchor_lang::prelude::*;
use anchor_lang::solana_program::{program::invoke, program::invoke_signed, system_instruction};
use anchor_spl::token::{self, Token, TokenAccount, Transfer};

pub mod constants;
pub mod errors;
pub mod state;

use errors::ErrorCode;
use state::escrow::Escrow;

declare_id!("FxtUUx1J4NiWoLtpaqstk9obhEdVMjaCth4UwfSuRC6F");
#[program]
pub mod lets_deal {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>, amount: u64, deadline: i64, nft_mint: Pubkey) -> Result<()> {
        let escrow = &mut ctx.accounts.escrow;
        require!(amount > 0, ErrorCode::InvalidAmount);
        let clock = Clock::get()?;
        require!(deadline > clock.unix_timestamp, ErrorCode::InvalidDeadline);
        escrow.buyer = ctx.accounts.buyer.key();
        escrow.seller = ctx.accounts.seller.key();
        escrow.amount = amount;
        escrow.deadline = deadline;
        escrow.nft_mint = nft_mint;
        escrow.state = 0;
        Ok(())
    }

    pub fn deposit_funds(ctx: Context<DepositFunds>) -> Result<()> {
        let escrow = &mut ctx.accounts.escrow;
        require!(escrow.state == 0, ErrorCode::InvalidState);
        require!(escrow.buyer == ctx.accounts.buyer.key(), ErrorCode::Unauthorized);
        let ix = system_instruction::transfer(
            &ctx.accounts.buyer.key(),
            &ctx.accounts.vault.key(),
            escrow.amount,
        );
        invoke(
            &ix,
            &[
                ctx.accounts.buyer.to_account_info(),
                ctx.accounts.vault.to_account_info(),
            ],
        )?;
        escrow.state = 1;
        Ok(())
    }

    pub fn deposit_nft(ctx: Context<DepositNFT>) -> Result<()> {
        let escrow = &mut ctx.accounts.escrow;
        require!(escrow.state == 1, ErrorCode::InvalidState);
        require!(escrow.seller == ctx.accounts.seller.key(), ErrorCode::Unauthorized);
        let cpi_accounts = Transfer {
            from: ctx.accounts.seller_nft_account.to_account_info(),
            to: ctx.accounts.vault_nft_account.to_account_info(),
            authority: ctx.accounts.seller.to_account_info(),
        };
        let cpi_ctx = CpiContext::new(ctx.accounts.token_program.to_account_info(), cpi_accounts);
        token::transfer(cpi_ctx, 1)?;
        escrow.state = 2;
        Ok(())
    }

    pub fn execute_trade(ctx: Context<ExecuteTrade>) -> Result<()> {
        let escrow = &mut ctx.accounts.escrow;
        require!(escrow.state == 1, ErrorCode::InvalidState);
        require!(escrow.seller == ctx.accounts.seller.key(), ErrorCode::Unauthorized);
        let escrow_key = escrow.key();
        let seeds = &[b"vault", escrow_key.as_ref(), &[ctx.bumps.vault]];
        let signer = &[&seeds[..]];
        let nft_transfer_accounts = Transfer {
            from: ctx.accounts.vault_nft_account.to_account_info(),
            to: ctx.accounts.buyer_nft_account.to_account_info(),
            authority: ctx.accounts.vault.to_account_info(),
        };
        let nft_cpi_ctx = CpiContext::new_with_signer(
            ctx.accounts.token_program.to_account_info(),
            nft_transfer_accounts,
            signer,
        );
        token::transfer(nft_cpi_ctx, 1)?;
        let sol_ix = system_instruction::transfer(
            &ctx.accounts.vault.key(),
            &ctx.accounts.seller.key(),
            escrow.amount,
        );
        invoke_signed(
            &sol_ix,
            &[
                ctx.accounts.vault.to_account_info(),
                ctx.accounts.seller.to_account_info(),
            ],
            signer,
        )?;
        escrow.state = 2;
        Ok(())
    }

    pub fn refund(ctx: Context<Refund>) -> Result<()> {
        let escrow = &mut ctx.accounts.escrow;
        let clock = Clock::get()?;
        require!(clock.unix_timestamp > escrow.deadline, ErrorCode::TooEarly);
        // TODO: transfer SOL → buyer
        // TODO: transfer NFT → seller
        escrow.state = 3;
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(init, payer = buyer, space = Escrow::LEN)]
    pub escrow: Account<'info, Escrow>,
    /// CHECK: PDA vault account derived from escrow
    #[account(mut, seeds = [b"vault", escrow.key().as_ref()], bump)]
    pub vault: UncheckedAccount<'info>,
    #[account(mut)]
    pub buyer: Signer<'info>,
    /// CHECK: seller is stored but not validated on-chain
    pub seller: UncheckedAccount<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct DepositFunds<'info> {
    #[account(mut)]
    pub escrow: Account<'info, Escrow>,
    #[account(mut)]
    pub buyer: Signer<'info>,
    /// CHECK: PDA vault
    #[account(mut, seeds = [b"vault", escrow.key().as_ref()], bump)]
    pub vault: UncheckedAccount<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct DepositNFT<'info> {
    #[account(mut)]
    pub escrow: Account<'info, Escrow>,
    #[account(mut)]
    pub seller: Signer<'info>,
    #[account(mut)]
    pub seller_nft_account: Account<'info, TokenAccount>,
    /// CHECK: PDA vault account derived from escrow
    #[account(mut, seeds = [b"vault", escrow.key().as_ref()], bump)]
    pub vault: UncheckedAccount<'info>,
    #[account(mut)]
    pub vault_nft_account: Account<'info, TokenAccount>,
    pub token_program: Program<'info, Token>,
}

#[derive(Accounts)]
pub struct ExecuteTrade<'info> {
    #[account(mut)]
    pub escrow: Account<'info, Escrow>,
    /// CHECK: PDA vault
    #[account(mut, seeds = [b"vault", escrow.key().as_ref()], bump)]
    pub vault: UncheckedAccount<'info>,
    /// CHECK: seller
    #[account(mut)]
    pub seller: UncheckedAccount<'info>,
    /// CHECK: buyer
    #[account(mut)]
    pub buyer: UncheckedAccount<'info>,
    #[account(mut)]
    pub vault_nft_account: Account<'info, TokenAccount>,
    #[account(mut)]
    pub buyer_nft_account: Account<'info, TokenAccount>,
    pub token_program: Program<'info, Token>,
}

#[derive(Accounts)]
pub struct Refund<'info> {
    #[account(mut)]
    pub escrow: Account<'info, Escrow>,
    /// CHECK: PDA vault
    #[account(mut)]
    pub vault: UncheckedAccount<'info>,
    #[account(mut)]
    pub buyer: Signer<'info>,
}