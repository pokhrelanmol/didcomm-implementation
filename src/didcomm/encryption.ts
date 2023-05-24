import crypto from "crypto";
import { DidcommMessage } from "./message";

export function encryptMessage(
  message: DidcommMessage,
  sharedSecret: Buffer
): Buffer {
  try {
    const iv = crypto.randomBytes(12);
    const cipher = crypto.createCipheriv("aes-256-gcm", sharedSecret, iv);
    const encrypted = Buffer.concat([
      cipher.update(JSON.stringify(message), "utf8"),
      cipher.final(),
    ]);
    const tag = cipher.getAuthTag();
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
    const iv = encrypted.slice(0, 12);
    const tag = encrypted.slice(12, 28);
    const text = encrypted.slice(28);
    const decipher = crypto.createDecipheriv("aes-256-gcm", sharedSecret, iv);
    decipher.setAuthTag(tag);
    const decrypted = decipher.update(text) + decipher.final("utf8");
    console.log("Message decrypted successfully");
    return JSON.parse(decrypted);
  } catch (error) {
    console.error("Error decrypting message:", error);
    throw error;
  }
}
