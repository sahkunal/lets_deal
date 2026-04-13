use anchor_lang::prelude::*;
use crate::state::escrow::Escrow;
use crate::errors::ErrorCode;

#[derive(Accounts)]
pub struct Refund<'info> {
    #[account(mut)]
    pub escrow: Account<'info, Escrow>,

    #[account(mut)]
    pub vault: UncheckedAccount<'info>,

    #[account(mut)]
    pub buyer: Signer<'info>,
}

pub fn handler(ctx: Context<Refund>) -> Result<()> {
    let escrow = &mut ctx.accounts.escrow;
    let clock = Clock::get()?;

    require!(clock.unix_timestamp > escrow.deadline, ErrorCode::TooEarly);

    // TODO:
    // transfer SOL → buyer
    // transfer NFT → seller

    escrow.state = 3;

    Ok(())
}