use anchor_lang::prelude::*;
use anchor_lang::solana_program::{program::invoke_signed, system_instruction};

use crate::state::escrow::Escrow;
use crate::errors::ErrorCode;

#[derive(Accounts)]
pub struct ExecuteTrade<'info> {
    #[account(mut)]
    pub escrow: Account<'info, Escrow>,

    /// 🔐 Vault PDA (same seeds as before)
    #[account(
        mut,
        seeds = [b"vault", escrow.key().as_ref()],
        bump
    )]
    pub vault: UncheckedAccount<'info>,

    /// CHECK: seller receiving SOL
    #[account(mut)]
    pub seller: UncheckedAccount<'info>,
}

pub fn handler(ctx: Context<ExecuteTrade>) -> Result<()> {
    let escrow = &mut ctx.accounts.escrow;

    // ✅ 1. STATE CHECK
    require!(escrow.state == 1, ErrorCode::InvalidState);

    // ✅ 2. SELLER VALIDATION
    require!(
        escrow.seller == ctx.accounts.seller.key(),
        ErrorCode::Unauthorized
    );

    // ✅ 3. PDA SIGNER SEEDS
    let escrow_key = escrow.key();
    let seeds = &[
        b"vault",
        escrow_key.as_ref(),
        &[ctx.bumps.vault],
    ];
    let signer = &[&seeds[..]];

    // ✅ 4. TRANSFER SOL: VAULT → SELLER
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

    // ✅ 5. UPDATE STATE
    escrow.state = 2;

    Ok(())
}