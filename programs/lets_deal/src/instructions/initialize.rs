use anchor_lang::prelude::*;
use crate::state::escrow::Escrow;
use crate::errors::ErrorCode;

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(
        init,
        payer = buyer,
        space = Escrow::LEN,
    )]
    pub escrow: Account<'info, Escrow>,
    /// CHECK: PDA vault account derived from escrow
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

pub fn handler(
    ctx: Context<Initialize>,
    amount: u64,
    deadline: i64,
    nft_mint: Pubkey,
) -> Result<()> {
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