import axios from "axios";
import { DidcommMessage } from "../models/didcommMessage";

// Send a DIDComm message over HTTP
export async function sendHttpMessage(
  message: DidcommMessage,
  url: string
): Promise<void> {
  try {
    const response = await axios.post(url, message);
    console.log("Message sent successfully:", response.status);
  } catch (error) {
    console.error("Error sending message:", error);
    throw error;
  }
}

// Receive a DIDComm message over HTTP
// This function would be used in an HTTP server route handler
export function receiveHttpMessage(requestBody: any): DidcommMessage {
  try {
    const message = requestBody as DidcommMessage;
    console.log("Message received successfully");
    return message;
  } catch (error) {
    console.error("Error receiving message:", error);
    throw error;
  }
}
