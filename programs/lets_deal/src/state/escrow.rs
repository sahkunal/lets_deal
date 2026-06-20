use anchor_lang::prelude::*;

#[derive(
    AnchorSerialize,
    AnchorDeserialize,
    Clone,
    PartialEq,
    Eq
)]
pub enum EscrowState {
    Initialized,
    FundsDeposited,
    NftDeposited,
    Completed,
    Refunded,
}

#[account]
pub struct Escrow {
    pub buyer: Pubkey,
    pub seller: Pubkey,
    pub amount: u64,
    pub deadline: i64,
    pub nft_mint: Pubkey,
    pub state: EscrowState,
}

impl Escrow {
    pub const LEN: usize =
        8 +     // discriminator
        32 +    // buyer
        32 +    // seller
        8 +     // amount
        8 +     // deadline
        32 +    // nft_mint
        1;      // state enum
}