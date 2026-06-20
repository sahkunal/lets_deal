use anchor_lang::{
    prelude::*,
    solana_program::{
        program::invoke,
        system_instruction,
    },
};

use crate::{
    errors::ErrorCode,
    state::{EscrowState, escrow::Escrow},
};

#[derive(Accounts)]
pub struct DepositFunds<'info> {
    #[account(mut)]
    pub escrow: Account<'info, Escrow>,

    #[account(mut)]
    pub buyer: Signer<'info>,

    /// CHECK:
    #[account(
        mut,
        seeds = [b"vault", escrow.key().as_ref()],
        bump
    )]
    pub vault: UncheckedAccount<'info>,

    pub system_program: Program<'info, System>,
}

pub fn handler(ctx: Context<DepositFunds>) -> Result<()> {
    let escrow = &mut ctx.accounts.escrow;

    require!(
    escrow.state == EscrowState::Initialized,
    ErrorCode::InvalidState
);

    require!(
        escrow.buyer == ctx.accounts.buyer.key(),
        ErrorCode::Unauthorized
    );

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

   escrow.state = EscrowState::FundsDeposited;

    Ok(())
}