use anchor_lang::prelude::*;

#[derive(Accounts)]
pub struct DepositNFT<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,
}

pub fn handler(_ctx: Context<DepositNFT>) -> Result<()> {
    Ok(())
}