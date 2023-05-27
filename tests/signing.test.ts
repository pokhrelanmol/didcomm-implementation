require("dotenv").config();
import { signMessage, verifyMessageSignature } from "../src/didcomm/signing";
import { generateKeypairs } from "../src/utils/keyManagement";
import { DidcommMessage } from "../src/models/didcommMessage";
import { v4 as uuidv4 } from "uuid";
import * as Kilt from "@kiltprotocol/sdk-js";
import { DidResolveKey } from "@kiltprotocol/types";
import { waitReady } from "@polkadot/wasm-crypto";

const seed = process.env.ACCOUNT1_DID_MNEMONIC!;
const ACCOUNT1_DID = process.env.ACCOUNT1_DID_URI!;
const ACCOUNT2_DID = process.env.ACCOUNT2_DID_URI!;

describe("DIDComm Signing", () => {
  const testMessage: DidcommMessage = {
    id: "1234567890",
    type: "https://example.com/protocols/1.0/test",
    from: ACCOUNT1_DID,
    to: [ACCOUNT2_DID],
    created_time: Math.floor(Date.now() / 1000),
    expires_time: Math.floor(Date.now() / 1000) + 60,
    body: { test: "test" },
  };

  test("signMessage signs a valid message", async () => {
    await waitReady();
    await Kilt.connect(process.env.WSS_ADDRESS as string);
    const { authentication } = generateKeypairs(seed);
    const signature: Kilt.DidSignature = await signMessage(
      testMessage,
      async ({ data }) => ({
        signature: authentication.sign(data),
        keyType: authentication.type,
      }),
      ACCOUNT1_DID as Kilt.DidUri
    );

    expect(signature).toBeDefined();
    Kilt.disconnect();
  });

  test("verifyMessageSignature correctly verifies a valid signature", async () => {
    await waitReady();
    await Kilt.connect(process.env.WSS_ADDRESS as string);

    const { authentication } = generateKeypairs(seed);

    const signature: Kilt.DidSignature = await signMessage(
      testMessage,
      async ({ data }) => ({
        signature: authentication.sign(data),
        keyType: authentication.type,
      }),
      ACCOUNT1_DID as Kilt.DidUri
    );

    const verified = await verifyMessageSignature(testMessage, signature);

    expect(verified).toBe(true);
    Kilt.disconnect();
  });
});
