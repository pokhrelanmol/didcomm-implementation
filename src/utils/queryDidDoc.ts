import * as Kilt from "@kiltprotocol/sdk-js";
export async function getDidDoc(did: Kilt.DidUri) {
    await Kilt.connect("wss://peregrine.kilt.io/parachain-public-ws");
    const api = Kilt.ConfigService.get("api");

    const encodedFullDid = await api.call.did.query(Kilt.Did.toChain(did));
    const { document } = Kilt.Did.linkedInfoFromChain(encodedFullDid);
    return document;
}
