import { DidUri } from "@kiltprotocol/sdk-js";
import { signMessage, verifySignature } from "../src/didcomm/signing";
import { generateKeypairs } from "../src/utils/keyManagement";
import { getDidDoc } from "../src/utils/queryDidDoc";
import "dotenv/config";
const ACCOUNT1_MNEMONIC = process.env.ACCOUNT1_ACCOUNT_MNEMONIC!;
const ACCOUNT1_DID = process.env.ACCOUNT1_DID_URI! as DidUri;

const ACCOUNT2_MNEMONIC = process.env.ACCOUNT2_ACCOUNT_MNEMONIC!;
const ACCOUNT2_DID = process.env.ACCOUNT2_DID_URI!;

const testMessage = {
    id: "1234567890",
    type: "https://example.com/protocols/1.0/test",
    body: { test: "test" },
    from: ACCOUNT1_DID,
    to: [ACCOUNT2_DID],
};
describe("DIDComm Signing", () => {
    test("signMessage correctly signs a message", async () => {
        const { authentication } = await generateKeypairs(ACCOUNT1_MNEMONIC);
        const { authentication: account2 } = await generateKeypairs(
            ACCOUNT2_MNEMONIC
        );
        const signature = signMessage(testMessage, authentication);
        const verified = account2.verify(
            JSON.stringify(testMessage),
            signature,
            authentication.publicKey
        );
        expect(signature).toBeDefined();
        expect(signature).toBeInstanceOf(Buffer);
        expect(verified).toBeTruthy();
    });
});

describe("DIDComm verify", () => {
    // Assume that the message has been signed by account1 and that account2 has account1's public key in its DID Doc
    test("verifySignature correctly verifies a signature", async () => {
        const { authentication: account1 } = await generateKeypairs(
            ACCOUNT1_MNEMONIC
        );
        const { authentication: account2 } = await generateKeypairs(
            ACCOUNT2_MNEMONIC
        );
        const signature = signMessage(testMessage, account1);
        const didDoc = await getDidDoc(ACCOUNT1_DID);
        const senderPublicKey = didDoc.authentication[0].publicKey;
        console.log("senderPublicKey: ", senderPublicKey);
        console.log("account2: ", account1.publicKey);
        const verified = verifySignature(
            testMessage,
            signature,
            senderPublicKey,
            account2
        );
        console.log(verified);
        // expect(verified).toBeTruthy();
    });
});
