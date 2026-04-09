use anchor_lang::prelude::*;
use crate::state::escrow::Escrow;

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(
        init,
        payer = buyer,
        space = Escrow::LEN,
    )]
    pub escrow: Account<'info, Escrow>,

    #[account(
        mut,
        seeds = [b"vault", escrow.key().as_ref()],
        bump
    )]
    pub vault: UncheckedAccount<'info>,

    #[account(mut)]
    pub buyer: Signer<'info>,

    pub seller: UncheckedAccount<'info>,

    pub system_program: Program<'info, System>,
}