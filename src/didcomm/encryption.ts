import crypto from "crypto";
import { DidcommMessage } from "../models/didcommMessage";
import { JWK, JWE } from "node-jose";

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

    const iv = crypto.randomBytes(12);

    const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);
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
    const key = deriveKey(sharedSecret);

    const iv = encrypted.subarray(0, 12);

    const tag = encrypted.subarray(12, 28);

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

export async function encryptMessage(
  message: DidcommMessage,
  sharedSecret: Buffer
): Promise<string> {
  // Convert the shared secret to a JWK
  const key = await JWK.asKey(sharedSecret, "oct");

  // Encrypt the message
  const jwe = await JWE.createEncrypt({ format: "compact" }, key)
    .update(JSON.stringify(message))
    .final();

  console.log("Message encrypted successfully");
  return jwe;
}

export async function decryptMessage(
  jwe: string,
  sharedSecret: Buffer
): Promise<DidcommMessage> {
  // Convert the shared secret to a JWK
  const key = await JWK.asKey(sharedSecret, "oct");

  // Decrypt the message
  const result = await JWE.createDecrypt(key).decrypt(jwe);
  const message = JSON.parse(result.plaintext.toString());

  console.log("Message decrypted successfully");
  return message;
}
