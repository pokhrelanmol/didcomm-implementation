export interface DidcommMessage {
  id: string;
  type: string;
  body: any;
  from?: string;
  to?: string[];
  created_time?: number;
  expires_time?: number;

  attachments?: Attachment[];
}

interface Attachment {
  id: string;
  data: {
    json?: any;
    base64?: string;
  };
}
