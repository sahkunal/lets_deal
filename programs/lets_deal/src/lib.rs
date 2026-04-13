use anchor_lang::prelude::*;

pub mod state;
pub mod instructions;
pub mod errors;
pub mod constants;

declare_id!("8Hw3CnetkoDMGppgoTmWxW11LswHvnhVUMCu3hAsjZ64");

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

    pub fn deposit_funds(ctx: Context<DepositFunds>, amount: u64) -> Result<()> {
        instructions::deposit_funds::handler(ctx, amount)
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