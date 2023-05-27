import { queryFullDid } from "../utils/didResolver";
import * as Kilt from "@kiltprotocol/sdk-js";
import { config as envConfig } from "dotenv";

const didUri = "did:kilt:4qNLDkBxZDaM5U2jKkHro4xkQsyhnXFWMvQJ71WzAfDM51WU";

// Retrieve Full DID Document from chain
async function getFullDidFromChain(
  didUri: Kilt.DidUri
): Promise<Kilt.DidDocument> {
  const document = await queryFullDid(didUri);
  if (!document) {
    throw new Error("Full DID was not successfully created.");
  }
  return document;
}

// Run the function and console.log the result
(async () => {
  envConfig();
  await Kilt.connect(process.env.WSS_ADDRESS as string);

  const document = await getFullDidFromChain(didUri);
  console.log(`Full DID Document: ${JSON.stringify(document, null, 2)}`);
})();
