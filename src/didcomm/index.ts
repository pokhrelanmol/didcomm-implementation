import { createMessage, parseMessage, validateMessage } from "./message";
import { encryptMessage, decryptMessage } from "./encryption";
import { signMessage, verifyMessageSignature } from "./signing";
import { deriveSharedSecret } from "../utils/secretResolver";
import { DidcommMessage } from "../models/didcommMessage";
import nacl from "tweetnacl";

// Send a DIDComm message
export async function sendMessage(
  message: DidcommMessage,
  receiverPublicKey: Uint8Array,
  senderPrivateKey: Uint8Array
): Promise<{ encrypted: Buffer; nonce: Uint8Array }> {
  try {
    // Sign the message

    // Generate a random nonce
    const nonce = nacl.randomBytes(nacl.box.nonceLength);

    // Encrypt the message and the signature using the nonce

    const sharedSecretUint8Array = deriveSharedSecret(
      senderPrivateKey,
      receiverPublicKey,
      nonce
    );
    const sharedSecret = Buffer.from(sharedSecretUint8Array); //why convert to buffer?
    const encrypted = encryptMessage({ ...message }, sharedSecret);
    console.log("This is the encrypted message:", encrypted);

    console.log("Message sent successfully");
    return { encrypted, nonce };
  } catch (error) {
    console.error("Error sending message:", error);
    throw error;
  }
}

// Receive a DIDComm message
export async function receiveMessage(
  encrypted: Buffer,
  receiverPrivateKey: Uint8Array,
  senderPublicKey: Uint8Array,
  nonce: Uint8Array
): Promise<DidcommMessage> {
  try {
    // Decrypt the message using the provided nonce
    const sharedSecretUint8Array = deriveSharedSecret(
      receiverPrivateKey,
      senderPublicKey,
      nonce
    );

    const sharedSecret = Buffer.from(sharedSecretUint8Array);
    const message = decryptMessage(encrypted, sharedSecret);

    // Verify the signature

    console.log("Message received successfully");
    return message;
  } catch (error) {
    console.error("Error receiving message:", error);
    throw error;
  }
}
