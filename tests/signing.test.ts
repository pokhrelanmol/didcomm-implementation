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
    const { authentication } = generateKeypairs(seed);
    const signature: Kilt.DidSignature = await signMessage(
      testMessage,
      async ({ data }) => ({
        signature: authentication.sign(data),
        keyType: authentication.type,
      }),
      ACCOUNT1_DID as Kilt.DidUri
    );
    console.log("This is our keyUri----", signature.keyUri);
    console.log("This is our signature----", signature.signature);

    expect(signature).toBeDefined();
  });

  test.only("verifyMessageSignature correctly verifies a valid signature", async () => {
    await waitReady();
    await Kilt.connect(process.env.WSS_ADDRESS as string);
    const api = Kilt.ConfigService.get("api");
    const { authentication } = generateKeypairs(seed);
    console.log("This is our authentication----", authentication.publicKey);

    const signature: Kilt.DidSignature = await signMessage(
      testMessage,
      async ({ data }) => ({
        signature: authentication.sign(data),
        keyType: authentication.type,
      }),
      ACCOUNT2_DID as Kilt.DidUri
    );
    console.log("This is our signature----", signature.signature);
    console.log("This is our keyUri----", signature.keyUri);

    const { did, fragment: keyId } = Kilt.Did.parse(signature.keyUri);
    console.log("This is our did----", did);
    console.log("This is our keyId----", keyId);

    const verified = await verifyMessageSignature(
      testMessage,
      signature,
      ACCOUNT1_DID as Kilt.DidUri
    );
    expect(verified).toBe(true);
    Kilt.disconnect();
  });
});
