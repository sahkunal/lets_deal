use anchor_lang::{
    prelude::*,
    solana_program::{
        program::invoke_signed,
        system_instruction,
    },
};

use crate::{
    errors::ErrorCode,
    state::{EscrowState, escrow::Escrow},
};

#[derive(Accounts)]
pub struct Refund<'info> {
    #[account(mut)]
    pub escrow: Account<'info, Escrow>,

    /// CHECK:
    #[account(
        mut,
        seeds = [b"vault", escrow.key().as_ref()],
        bump
    )]
    pub vault: UncheckedAccount<'info>,

    #[account(mut)]
    pub buyer: Signer<'info>,

    pub system_program: Program<'info, System>,
}

pub fn handler(ctx: Context<Refund>) -> Result<()> {
    let escrow = &mut ctx.accounts.escrow;

    let clock = Clock::get()?;

    require!(
        clock.unix_timestamp > escrow.deadline,
        ErrorCode::TooEarly
    );

    let escrow_key = escrow.key();

    let seeds = &[
        b"vault",
        escrow_key.as_ref(),
        &[ctx.bumps.vault],
    ];

    let signer = &[&seeds[..]];

    let vault_balance = ctx.accounts.vault.lamports();

    if vault_balance > 0 {
        let sol_ix = system_instruction::transfer(
            &ctx.accounts.vault.key(),
            &ctx.accounts.buyer.key(),
            vault_balance,
        );

        invoke_signed(
            &sol_ix,
            &[
                ctx.accounts.vault.to_account_info(),
                ctx.accounts.buyer.to_account_info(),
                ctx.accounts.system_program.to_account_info(),
            ],
            signer,
        )?;
    }

   escrow.state = EscrowState::Refunded;

    Ok(())
}