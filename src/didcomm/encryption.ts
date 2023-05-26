import crypto from "crypto";
import { DidcommMessage } from "../models/didcommMessage";

function deriveKey(sharedSecret: Buffer) {
  const hmac = crypto.createHmac("sha256", sharedSecret);
  hmac.update("Some constant value"); // This could be a nonce, for example
  return hmac.digest();
}

export function encryptMessage(
  message: DidcommMessage,
  sharedSecret: Buffer
): Buffer {
  try {
    const key = deriveKey(sharedSecret);
    console.log("This is the key used in encryption:", key);
    const iv = crypto.randomBytes(12);
    console.log("This is the iv used in encryption:", iv);
    const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);
    const encrypted = Buffer.concat([
      cipher.update(JSON.stringify(message), "utf8"),
      cipher.final(),
    ]);
    const tag = cipher.getAuthTag();
    console.log("This is the tag used in encryption:", tag);
    console.log("Message encrypted successfully");
    return Buffer.concat([iv, tag, encrypted]);
  } catch (error) {
    console.error("Error encrypting message:", error);
    throw error;
  }
}

// Decrypt a DIDComm message
export function decryptMessage(
  encrypted: Buffer,
  sharedSecret: Buffer
): DidcommMessage {
  try {
    const key = deriveKey(sharedSecret);
    console.log("This is the key used in decryption:", key);
    const iv = encrypted.subarray(0, 12);
    console.log("This is the iv used in decryption:", iv);
    const tag = encrypted.subarray(12, 28);
    console.log("This is the tag used in decryption:", tag);
    const text = encrypted.subarray(28);
    const decipher = crypto.createDecipheriv("aes-256-gcm", key, iv);
    decipher.setAuthTag(tag);
    const decrypted = decipher.update(text) + decipher.final("utf8");
    console.log("Message decrypted successfully");
    return JSON.parse(decrypted);
  } catch (error) {
    console.error("Error decrypting message:", error);
    throw error;
  }
}
