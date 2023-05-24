import crypto from "crypto";
import { DidcommMessage } from "../models/didcommMessage";

// Sign a DIDComm message
export function signMessage(
  message: DidcommMessage,
  privateKey: Buffer
): Buffer {
  try {
    const sign = crypto.createSign("SHA256");
    sign.update(JSON.stringify(message));
    const signature = sign.sign(privateKey);
    console.log("Message signed successfully");
    return signature;
  } catch (error) {
    console.error("Error signing message:", error);
    throw error;
  }
}

// Verify the signature of a DIDComm message
export function verifySignature(
  message: DidcommMessage,
  signature: Buffer,
  publicKey: Buffer
): boolean {
  try {
    const verify = crypto.createVerify("SHA256");
    verify.update(JSON.stringify(message));
    const verified = verify.verify(publicKey, signature);
    console.log("Signature verified successfully");
    return verified;
  } catch (error) {
    console.error("Error verifying signature:", error);
    throw error;
  }
}
