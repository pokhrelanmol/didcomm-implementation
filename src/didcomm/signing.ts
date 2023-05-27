import crypto, { SignPrivateKeyInput } from "crypto";
import { DidcommMessage } from "../models/didcommMessage";
import { KiltKeyringPair } from "@kiltprotocol/sdk-js";

// Sign a DIDComm message

export function signMessage(
    message: DidcommMessage,
    authentication: KiltKeyringPair
): Buffer {
    try {
        const signature = authentication.sign(JSON.stringify(message));
        console.log("Message signed successfully");
        return Buffer.from(signature);
    } catch (error) {
        console.error("Error signing message:", error);
        throw error;
    }
}

// Verify the signature of a DIDComm message
export function verifySignature(
    message: DidcommMessage,
    signature: Buffer,
    publicKey: Uint8Array,
    authentication: KiltKeyringPair
): boolean {
    console.log(authentication);

    try {
        const verified = authentication.verify(
            JSON.stringify(message),
            signature,
            publicKey
        );
        console.log("Signature verified successfully");
        return verified;
    } catch (error) {
        console.error("Error verifying signature:", error);
        throw error;
    }
}
