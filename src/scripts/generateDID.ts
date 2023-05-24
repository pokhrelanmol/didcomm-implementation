import { generateKeypairs } from "../utils/keyManagement";
import * as Kilt from "@kiltprotocol/sdk-js";
import { config as envConfig } from "dotenv";

import { generateAccount } from "../utils/generateAccount";
import { createFullDid } from "../utils/didResolver";

if (require.main === module) {
  (async () => {
    envConfig();

    try {
      await Kilt.connect(process.env.WSS_ADDRESS as string);

      // Load attester account
      const accountMnemonic = process.env.ACCOUNT2_ACCOUNT_MNEMONIC as string;
      const { account } = generateAccount(accountMnemonic);
      const { mnemonic } = await createFullDid(account);

      console.log("\nsave following to .env to continue\n");
      console.error(`USER_DID_MNEMONIC="${mnemonic}"\n`);
    } catch (e) {
      console.log("Error while creating attester DID");
      throw e;
    }
  })();
}
