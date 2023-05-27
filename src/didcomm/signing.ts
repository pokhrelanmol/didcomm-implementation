import crypto from "crypto";
import { DidcommMessage } from "../models/didcommMessage";
import { KiltKeyringPair } from "@kiltprotocol/sdk-js";

// Sign a DIDComm message
export function signMessage(
    message: DidcommMessage,
    capabilityDelegation: KiltKeyringPair
): Buffer {
    try {
        const signature = capabilityDelegation.sign(JSON.stringify(message));

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
    publicKey: Buffer
): boolean {
    try {
        const _verify = crypto.createVerify("SHA256");
        _verify.update(JSON.stringify(message));
        const verified = _verify.verify(publicKey, signature);
        console.log("Signature verified successfully");
        return verified;
    } catch (error) {
        console.error("Error verifying signature:", error);
        throw error;
    }
}
