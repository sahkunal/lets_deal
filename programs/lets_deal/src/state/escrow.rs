use anchor_lang::prelude::*;

#[account]
pub struct Escrow {
    pub buyer: Pubkey,
    pub seller: Pubkey,
    pub nft_mint: Pubkey,
    pub amount: u64,
    pub deadline: i64,
    pub state: u8, // 0=init, 1=funded, 2=completed, 3=refunded
}

impl Escrow {
    pub const LEN: usize = 8 + 32 + 32 + 32 + 8 + 8 + 1;
}
