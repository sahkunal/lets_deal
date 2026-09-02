import { sha256 } from "js-sha256";

// Anchor computes the 8-byte discriminator prefixed to every instruction's
// data as sha256("global:<snake_case_ix_name>")[0..8], and every account's
// data as sha256("account:<PascalCase_struct_name>")[0..8]. Recomputing it
// here means this frontend never depends on a generated IDL file matching
// exactly the Anchor CLI version used to build the program.
export function ixDiscriminator(name: string): Buffer {
  const hash = sha256.array(`global:${name}`);
  return Buffer.from(hash.slice(0, 8));
}

export function accountDiscriminator(name: string): Buffer {
  const hash = sha256.array(`account:${name}`);
  return Buffer.from(hash.slice(0, 8));
}
