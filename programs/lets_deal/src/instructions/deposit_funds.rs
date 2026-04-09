use anchor_lang::prelude::*;
use anchor_lang::system_program;

use crate::state::escrow::Escrow;
use crate::errors::ErrorCode;

#[derive(Accounts)]
pub struct DepositFunds<'info> {
    #[account(mut)]
    pub escrow: Account<'info, Escrow>,

    #[account(mut)]
    pub buyer: Signer<'info>,

    #[account(
        mut,
        seeds = [b"vault", escrow.key().as_ref()],
        bump
    )]
    pub vault: SystemAccount<'info>,

    pub system_program: Program<'info, System>,
}

pub fn handler(ctx: Context<DepositFunds>) -> Result<()> {
    let escrow = &mut ctx.accounts.escrow;

    require!(escrow.state == 0, ErrorCode::InvalidState);

    require!(
        escrow.buyer == ctx.accounts.buyer.key(),
        ErrorCode::Unauthorized
    );

    let cpi_ctx = CpiContext::new(
        ctx.accounts.system_program.to_account_info(),
        system_program::Transfer {
            from: ctx.accounts.buyer.to_account_info(),
            to: ctx.accounts.vault.to_account_info(),
        },
    );

    system_program::transfer(cpi_ctx, escrow.amount)?;
    escrow.state = 1;

    Ok(())
}