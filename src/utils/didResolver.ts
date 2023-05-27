import { config as envConfig } from "dotenv";
import { mnemonicGenerate } from "@polkadot/util-crypto";
import * as Kilt from "@kiltprotocol/sdk-js";
import { generateAccount } from "./generateAccount";
import { generateKeypairs } from "./keyManagement";

// Create a full DID
export async function createFullDid(
    submitterAccount: Kilt.KiltKeyringPair
): Promise<{
    mnemonic: string;
    fullDid: Kilt.DidDocument;
    keyAgreementPublicKey: Uint8Array;
    keyAgreementPrivateKey: Uint8Array;
}> {
    const api = Kilt.ConfigService.get("api");
    const mnemonic = mnemonicGenerate();
    const {
        authentication,
        keyAgreement,
        assertionMethod,
        capabilityDelegation,
        keyAgreementPublicKey,
        keyAgreementPrivateKey,
    } = await generateKeypairs(mnemonic);

    // Get tx that will create the DID on chain and DID-URI that can be used to resolve the DID Document.
    const fullDidCreationTx = await Kilt.Did.getStoreTx(
        {
            authentication: [authentication],
            keyAgreement: [keyAgreement],
            assertionMethod: [assertionMethod],
            capabilityDelegation: [capabilityDelegation],
        },
        submitterAccount.address,
        async ({ data }) => ({
            signature: authentication.sign(data),
            keyType: authentication.type,
        })
    );

    await Kilt.Blockchain.signAndSubmitTx(fullDidCreationTx, submitterAccount);

    const didUri = Kilt.Did.getFullDidUriFromKey(authentication);
    const encodedFullDid = await api.call.did.query(Kilt.Did.toChain(didUri));
    const { document } = Kilt.Did.linkedInfoFromChain(encodedFullDid);

    if (!document) {
        throw new Error("Full DID was not successfully created.");
    } else {
        console.log(`Full DID ${didUri} successfully created.`);
        console.log(`Key Agreement Public Key: ${keyAgreementPublicKey}`);
        console.log(`Key Agreement Private Key: ${keyAgreementPrivateKey}`);
        console.log(`DID Document: ${JSON.stringify(document, null, 2)}`);
    }

    return {
        mnemonic,
        fullDid: document,
        keyAgreementPublicKey,
        keyAgreementPrivateKey,
    };
}

export async function queryFullDid(
    didUri: Kilt.DidUri
): Promise<Kilt.DidDocument | null> {
    const resolutionResult = await Kilt.Did.resolve(didUri);

    if (
        resolutionResult === null ||
        resolutionResult.metadata.deactivated ||
        resolutionResult.document === undefined
    ) {
        console.log(`DID ${didUri} has been deleted or does not exist.`);
        return null;
    } else {
        return resolutionResult.document;
    }
}
