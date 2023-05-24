import {
  createMessage,
  parseMessage,
  validateMessage,
} from "../src/didcomm/message";
import { DidcommMessage } from "../src/models/didcommMessage";
import { v4 as uuidv4 } from "uuid";

jest.mock("uuid", () => ({
  v4: () => "1234567890",
}));

describe("DIDComm Message", () => {
  const testMessage: DidcommMessage = {
    id: "1234567890",
    type: "https://example.com/protocols/1.0/test",
    from: "did:kilt:4nyKS4CT2BGzsGbmqeVRDZDk6vdAZ2EZGfd56mqPp25inuu8",
    to: ["did:kilt:4nyKS4CT2BGzsGbmqeVRDZDk6vdAZ2EZGfd56mqPp25inuu8"],
    created_time: Math.floor(Date.now() / 1000),
    expires_time: Math.floor(Date.now() / 1000) + 60,
    body: { test: "test" },
  };

  test("createMessage creates a valid message", () => {
    const message = createMessage(
      testMessage.type,
      testMessage.body,
      testMessage.from,
      testMessage.to,
      testMessage.created_time,
      testMessage.expires_time
    );
    expect(message).toEqual(testMessage);
  });

  test("parseMessage correctly parses a valid message", () => {
    const messageString = JSON.stringify(testMessage);
    const parsedMessage = parseMessage(messageString);
    expect(parsedMessage).toEqual(testMessage);
  });

  test("validateMessage correctly validates a valid message", () => {
    expect(validateMessage(testMessage)).toBe(true);
  });

  test("validateMessage correctly invalidates an invalid message", () => {
    const invalidMessage = { ...testMessage, id: "" };
    expect(validateMessage(invalidMessage)).toBe(false);
  });
});
