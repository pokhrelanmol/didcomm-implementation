require("dotenv").config();
import { sendMessage, receiveMessage } from "../src/didcomm/index";

const ACCOUNT1_PRIVATE_KEY =
  process.env.ACCOUNT1_DID_KEY_AGREEMENT_PRIVATE_KEY!;
const ACCOUNT1_PUBLIC_KEY = process.env.ACCOUNT1_DID_KEY_AGREEMENT_PUBLIC_KEY!;
const ACCOUNT1_DID = process.env.ACCOUNT1_DID_URI!;

const ACCOUNT2_PRIVATE_KEY =
  process.env.ACCOUNT2_DID_KEY_AGREEMENT_PRIVATE_KEY!;
const ACCOUNT2_PUBLIC_KEY = process.env.ACCOUNT2_DID_KEY_AGREEMENT_PUBLIC_KEY!;
const ACCOUNT2_DID = process.env.ACCOUNT2_DID_URI!;

const account1_private_key = Buffer.from(ACCOUNT1_PRIVATE_KEY);
const account1_public_key = Buffer.from(ACCOUNT1_PUBLIC_KEY);
const account2_private_key = Buffer.from(ACCOUNT2_PRIVATE_KEY);
const account2_public_key = Buffer.from(ACCOUNT2_PUBLIC_KEY);

const testMessage = {
  id: "1234567890",
  type: "https://example.com/protocols/1.0/test",
  body: { test: "test" },
  from: ACCOUNT1_DID,
  to: [ACCOUNT2_DID],
};

describe("DIDComm Encryption", () => {
  test("encryptMessage correctly encrypts a message", async () => {
    const encryptedMessage = await sendMessage(
      testMessage,
      account1_private_key,
      account1_public_key
    );
    expect(encryptedMessage).toBeDefined();
    expect(encryptedMessage).toBeInstanceOf(Buffer);
  });

  test.only("decryptMessage correctly decrypts a message", async () => {
    const { encrypted, nonce } = await sendMessage(
      testMessage,
      account1_private_key,
      account1_public_key
    );
    console.log("encryptedMessage", encrypted);
    const decryptedMessage = await receiveMessage(
      encrypted,
      account2_private_key,
      account1_public_key,
      nonce
    );
    expect(decryptedMessage).toBeDefined();
    expect(decryptedMessage).toEqual(testMessage);
  });
});
