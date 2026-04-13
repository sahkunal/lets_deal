use anchor_lang::prelude::*;
use anchor_lang::solana_program::{program::invoke_signed, system_instruction};

use crate::state::escrow::Escrow;
use crate::errors::ErrorCode;

#[derive(Accounts)]
pub struct ExecuteTrade<'info> {
    #[account(mut)]
    pub escrow: Account<'info, Escrow>,

    #[account(
        mut,
        seeds = [b"vault", escrow.key().as_ref()],
        bump
    )]
    pub vault: UncheckedAccount<'info>,
    /// CHECK: PDA vault account derived from escrow
    #[account(mut)]
    pub seller: UncheckedAccount<'info>,
}

pub fn handler(ctx: Context<ExecuteTrade>) -> Result<()> {
    let escrow = &mut ctx.accounts.escrow;

    require!(escrow.state == 1, ErrorCode::InvalidState);

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

    let ix = system_instruction::transfer(
        &ctx.accounts.vault.key(),
        &ctx.accounts.seller.key(),
        escrow.amount,
    );

    invoke_signed(
        &ix,
        &[
            ctx.accounts.vault.to_account_info(),
            ctx.accounts.seller.to_account_info(),
        ],
        signer,
    )?;

    escrow.state = 2;

    Ok(())
}