use anchor_lang::{
    prelude::*,
    solana_program::{
        program::invoke_signed,
        system_instruction,
    },
};

use anchor_spl::token::{
    self,
    Token,
    TokenAccount,
    Transfer,
};

use crate::{
    errors::ErrorCode,
    state::{EscrowState, escrow::Escrow},
};

#[derive(Accounts)]
pub struct ExecuteTrade<'info> {
    #[account(mut)]
    pub escrow: Account<'info, Escrow>,

    /// CHECK:
    #[account(
        mut,
        seeds = [b"vault", escrow.key().as_ref()],
        bump
    )]
    pub vault: UncheckedAccount<'info>,

    /// CHECK:
    #[account(mut)]
    pub seller: UncheckedAccount<'info>,

    /// CHECK:
    #[account(mut)]
    pub buyer: UncheckedAccount<'info>,

    #[account(mut)]
    pub vault_nft_account: Account<'info, TokenAccount>,

    #[account(mut)]
    pub buyer_nft_account: Account<'info, TokenAccount>,

    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
}

pub fn handler(ctx: Context<ExecuteTrade>) -> Result<()> {
    let escrow = &mut ctx.accounts.escrow;

    require!(
    escrow.state == EscrowState::NftDeposited,
    ErrorCode::InvalidState
);

    require!(
        escrow.seller == ctx.accounts.seller.key(),
        ErrorCode::Unauthorized
    );

    let escrow_key = escrow.key();

    let seeds = &[
        b"vault",
        escrow_key.as_ref(),
        &[ctx.bumps.vault],
    ];

    let signer = &[&seeds[..]];

    let nft_transfer_accounts = Transfer {
        from: ctx.accounts.vault_nft_account.to_account_info(),
        to: ctx.accounts.buyer_nft_account.to_account_info(),
        authority: ctx.accounts.vault.to_account_info(),
    };

    let nft_cpi_ctx = CpiContext::new_with_signer(
        ctx.accounts.token_program.to_account_info().key(),
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
            ctx.accounts.system_program.to_account_info(),
        ],
        signer,
    )?;

    escrow.state = EscrowState::Completed;

    Ok(())
}