use anchor_lang::prelude::*;

pub mod constants;
pub mod errors;
pub mod instructions;
pub mod state;

use instructions::*;

declare_id!("FzwhoLmFm8avMRpgwTL5mWiC8oi8RSqkbDdYBU7SeQj");

#[program]
pub mod lets_deal {
    use super::*;

    pub fn initialize(
        ctx: Context<Initialize>,
        amount: u64,
        deadline: i64,
        nft_mint: Pubkey,
    ) -> Result<()> {
        instructions::initialize::handler(ctx, amount, deadline, nft_mint)
    }

    pub fn deposit_funds(ctx: Context<DepositFunds>) -> Result<()> {
        instructions::deposit_funds::handler(ctx)
    }

    pub fn deposit_nft(ctx: Context<DepositNFT>) -> Result<()> {
        instructions::deposit_nft::handler(ctx)
    }

    pub fn execute_trade(ctx: Context<ExecuteTrade>) -> Result<()> {
        instructions::execute_trade::handler(ctx)
    }

    pub fn refund(ctx: Context<Refund>) -> Result<()> {
        instructions::refund::handler(ctx)
    }
}