export interface DidDocument {
  id: string;
  verificationMethod: VerificationMethod[];
  authentication: string[];
  keyAgreement: string[];
  "@context": string[];
  alsoKnownAs?: string[];
}

interface VerificationMethod {
  id: string;
  controller: string;
  type: string;
  publicKeyBase58: string;
}
