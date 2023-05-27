import { signMessage, verifySignature } from "../src/didcomm/signing";
import { generateKeypairs } from "../src/utils/keyManagement";
import "dotenv/config";
const ACCOUNT1_MNEMONIC = process.env.ACCOUNT1_ACCOUNT_MNEMONIC!;
const ACCOUNT1_PRIVATE_KEY =
    process.env.ACCOUNT1_DID_KEY_AGREEMENT_PRIVATE_KEY!;
const ACCOUNT1_PUBLIC_KEY = process.env.ACCOUNT1_ACCOUNT_PUBLIC_KEY!;
const ACCOUNT1_DID = process.env.ACCOUNT1_DID_URI!;

const ACCOUNT2_PRIVATE_KEY =
    process.env.ACCOUNT2_DID_KEY_AGREEMENT_PRIVATE_KEY!;
const ACCOUNT2_PUBLIC_KEY = process.env.ACCOUNT2_DID_KEY_AGREEMENT_PUBLIC_KEY!;
const ACCOUNT2_DID = process.env.ACCOUNT2_DID_URI!;

const account1_private_key = JSON.parse(ACCOUNT1_PRIVATE_KEY);
const account1_public_key = JSON.parse(ACCOUNT1_PUBLIC_KEY);
const account2_private_key = JSON.parse(ACCOUNT2_PRIVATE_KEY);
const account2_public_key = JSON.parse(ACCOUNT2_PUBLIC_KEY);

const testMessage = {
    id: "1234567890",
    type: "https://example.com/protocols/1.0/test",
    body: { test: "test" },
    from: ACCOUNT1_DID,
    to: [ACCOUNT2_DID],
};
describe("DIDComm Signing", () => {
    test("signMessage correctly signs a message", async () => {
        const { capabilityDelegation } = await generateKeypairs(
            ACCOUNT1_MNEMONIC
        );
        console.log(capabilityDelegation);
        const signature = signMessage(testMessage, capabilityDelegation);
        const uint8ArrayPublicKey = new Uint8Array(account1_public_key);
        console.log("capabilityDelegation", capabilityDelegation.publicKey);
        console.log("uint8ArrayPublicKey", uint8ArrayPublicKey);
        const verified = capabilityDelegation.verify(
            JSON.stringify(testMessage),
            signature,
            uint8ArrayPublicKey
        );
        expect(signature).toBeDefined();
        expect(signature).toBeInstanceOf(Buffer);
        expect(verified).toBeTruthy();
    });
});

describe("DIDComm verify", () => {
    test("verifySignature correctly verifies a signature", async () => {
        const { capabilityDelegation } = await generateKeypairs(
            ACCOUNT1_MNEMONIC
        );
        const signedMessage = signMessage(testMessage, capabilityDelegation);
        const verified = verifySignature(
            testMessage,
            signedMessage,
            account1_public_key
        );
        expect(verified).toBeTruthy();
    });
});
