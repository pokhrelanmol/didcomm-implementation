import { config as envConfig } from "dotenv";

import { mnemonicGenerate } from "@polkadot/util-crypto";

import * as Kilt from "@kiltprotocol/sdk-js";
import { waitReady } from "@polkadot/wasm-crypto";

export async function generateAccount(mnemonic = mnemonicGenerate()): Promise<{
    account: Kilt.KiltKeyringPair;
    mnemonic: string;
}> {
    await waitReady();
    const keyring = new Kilt.Utils.Keyring({
        ss58Format: 38,
        type: "sr25519",
    });
    return {
        account: keyring.addFromMnemonic(mnemonic) as Kilt.KiltKeyringPair,
        mnemonic,
    };
}

// Don't execute if this is imported by another file.
if (require.main === module) {
    (async () => {
        envConfig();

        try {
            await Kilt.init();

            const { mnemonic, account } = await generateAccount();
            console.log(
                "save to mnemonic and address to .env to continue!\n\n"
            );
            console.log(`USER_ACCOUNT_MNEMONIC="${mnemonic}"`);
            console.log(`USER_ACCOUNT_ADDRESS="${account.address}"\n\n`);
            console.log(`USER_ACCOUNT_PUBLIC_KEY="${account.publicKey}"\n\n`);
        } catch (e) {
            console.log("Error while setting up user account");
            throw e;
        }
    })();
}
