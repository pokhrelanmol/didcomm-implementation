import { deriveSharedSecret } from "../utils/secretResolver";
import nacl from "tweetnacl";

// Account 1
const ACCOUNT1_DID_KEY_AGREEMENT_PRIVATE_KEY = [
  125, 140, 72, 157, 96, 16, 206, 109, 49, 133, 253, 225, 50, 0, 153, 219, 159,
  216, 192, 90, 77, 241, 114, 153, 203, 126, 228, 33, 48, 249, 229, 90,
];
const ACCOUNT1_DID_KEY_AGREEMENT_PUBLIC_KEY = [
  53, 244, 150, 35, 54, 27, 84, 212, 75, 30, 103, 10, 61, 181, 132, 25, 117,
  182, 198, 19, 169, 30, 75, 29, 98, 22, 46, 161, 235, 143, 139, 31,
];

// Account 2
const ACCOUNT2_DID_KEY_AGREEMENT_PRIVATE_KEY = [
  100, 204, 196, 105, 61, 227, 57, 185, 232, 59, 230, 208, 169, 32, 70, 121,
  117, 134, 86, 147, 171, 253, 250, 103, 98, 216, 37, 42, 253, 112, 166, 41,
];
const ACCOUNT2_DID_KEY_AGREEMENT_PUBLIC_KEY = [
  243, 94, 107, 33, 230, 3, 167, 119, 248, 95, 227, 44, 180, 24, 105, 166, 43,
  138, 106, 255, 73, 254, 113, 37, 239, 119, 107, 2, 31, 127, 134, 58,
];

const nonce = nacl.randomBytes(nacl.box.nonceLength);

// Derive shared secrets
const sharedSecret1 = deriveSharedSecret(
  ACCOUNT1_DID_KEY_AGREEMENT_PRIVATE_KEY,
  ACCOUNT2_DID_KEY_AGREEMENT_PUBLIC_KEY,
  nonce
);
const sharedSecret2 = deriveSharedSecret(
  ACCOUNT2_DID_KEY_AGREEMENT_PRIVATE_KEY,
  ACCOUNT1_DID_KEY_AGREEMENT_PUBLIC_KEY,
  nonce
);
console.log("sharedSecret1", sharedSecret1);
console.log("sharedSecret2", sharedSecret2);
// Check if the shared secrets are the same
if (sharedSecret1 === sharedSecret2) {
  console.log("The shared secrets are the same.");
} else {
  console.log("The shared secrets are not the same.");
}
