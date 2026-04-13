use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token,TokenAccount, Transfer};

use crate::state::escrow::Escrow;
use crate::errors::ErrorCode;

#[derive(Accounts)]
pub struct DepositNFT<'info> {
    #[account(mut)]
    pub escrow: Account<'info, Escrow>,

    #[account(mut)]
    pub seller: Signer<'info>,

    #[account(mut)]
    pub seller_nft_account: Account<'info, TokenAccount>,
    /// CHECK: PDA vault account derived from escrow

    #[account(
        mut,
        seeds = [b"vault", escrow.key().as_ref()],
        bump
    )]
    pub vault: UncheckedAccount<'info>,

    #[account(mut)]
    pub vault_nft_account: Account<'info, TokenAccount>,

    pub token_program: Program<'info, Token>,
}

pub fn handler(ctx: Context<DepositNFT>) -> Result<()> {
    let escrow = &mut ctx.accounts.escrow;

    require!(escrow.state == 1, ErrorCode::InvalidState);

    require!(
        escrow.seller == ctx.accounts.seller.key(),
        ErrorCode::Unauthorized
    );

    let cpi_accounts = Transfer {
        from: ctx.accounts.seller_nft_account.to_account_info(),
        to: ctx.accounts.vault_nft_account.to_account_info(),
        authority: ctx.accounts.seller.to_account_info(),
    };

    let cpi_ctx = CpiContext::new(
        ctx.accounts.token_program.key(),
        cpi_accounts,
    );

    token::transfer(cpi_ctx, 1)?;
    
    escrow.state = 2;

    Ok(())
}