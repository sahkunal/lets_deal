use anchor_lang::prelude::*;

#[error_code]
pub enum ErrorCode {
    #[msg("Invalid state")]
    InvalidState,

    #[msg("Unauthorized")]
    Unauthorized,

    #[msg("Invalid amount")]
    InvalidAmount,

    #[msg("Deadline must be in future")]
    InvalidDeadline,

    #[msg("Deadline not reached")]
    TooEarly,
}