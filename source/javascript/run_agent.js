import {
  AgentsClient,
  DoneEvent,
  ErrorEvent,
  MessageStreamEvent,
  RunStreamEvent,
} from "@azure/ai-agents";
import { WebPubSubClient } from "@azure/web-pubsub-client";
import { WebPubSubServiceClient } from "@azure/web-pubsub";

import "dotenv/config";
import { DefaultAzureCredential } from "@azure/identity";
import fs from "fs";

// A custom credential is required for use in Azure Cloud Shell but isn't required on your local machine.
class VSCodeCredential {
  async getToken() {
    const token = fs.readFileSync("/tmp/ai_token", "utf8").trim();
    return { token, expiresOnTimestamp: 0 };
  }
}
const credential = new DefaultAzureCredential();

const projectEndpoint = process.env.PROJECT_ENDPOINT;
const modelDeploymentName = process.env.MODEL_DEPLOYMENT_NAME;
const wpsEndpoint = process.env.WPS_ENDPOINT;
const aiHub = process.env.WPS_AIHUB;
const group = process.env.WPS_SAMPLE_GROUP;
export class RoomContext {
  messages;
  threadId;
  streamingClient;
}
export const RoomThreadMap = new Map();

export async function createAgentService() {
  const client = new AgentsClient(projectEndpoint, credential);
  const agent = await client.createAgent(modelDeploymentName, {
    name: "chat-agent",
    instructions: "You are helpful and powerful agent.",
  });
  const streamingClient = await createStreamingClient();

  return {
    startChat: async (roomId) => {
      const threadId = RoomThreadMap.get(roomId);
      if (threadId) {
        return;
      }

      let thread = await client.threads.create();
      console.log(`Created thread, thread ID : ${thread.id}`);
      RoomThreadMap.set(roomId, thread.id);
      streamingClient.joinGroup(roomId);
      streamingClient.on("group-message", async (data) => {
        let message = data.message;
        if (message.group === roomId) {
          console.log(`Received message in group ${roomId}:`, message);
          const input = message.data.message;
          if (input) {
            console.log(`Sending message to agent: ${input}`);
            const message = await client.messages.create(
              thread.id,
              "user",
              input
            );

            console.log(
              `Created message, messageID: ${message.id}, thread ID : ${thread.id}, roomId: ${roomId}`
            );

            const streamEventMessages = await client.runs
              .create(thread.id, agent.id)
              .stream();

            for await (const eventMessage of streamEventMessages) {
              switch (eventMessage.event) {
                case RunStreamEvent.ThreadRunCreated:
                  console.log(`ThreadRun status: ${eventMessage.data.status}`);
                  break;
                case MessageStreamEvent.ThreadMessageDelta:
                  {
                    const messageDelta = eventMessage.data;
                    messageDelta.delta.content.forEach((contentPart) => {
                      if (contentPart.type === "text") {
                        const textContent = contentPart;
                        const textValue = textContent.text?.value || "No text";
                        console.log(`Text delta received:: ${textValue}`);
                        streamingClient.sendToGroup(
                          roomId,
                          {
                            message: textValue,
                            from: "agent",
                            streaming: true,
                            messageDeltaId: messageDelta.id,
                            messageId: message.id,
                          },
                          "json",
                          { noEcho: true }
                        );
                      }
                    });
                  }
                  break;
                case RunStreamEvent.ThreadRunCompleted:
                  console.log("Thread Run Completed");
                  break;
                case ErrorEvent.Error:
                  console.log(`An error occurred. Data ${eventMessage.data}`);
                  break;
                case DoneEvent.Done:
                  console.log("Stream completed.");
                  streamingClient.sendToGroup(
                    roomId,
                    {
                      streaming: true,
                      streamingEnd: true,
                      messageId: message.id,
                    },
                    "json",
                    { noEcho: true }
                  );
                  break;
              }
            }
          } else {
            console.error("No input message provided.");
          }
        }
      });
    },
  };
}

async function createStreamingClient() {
  const streamingService = new WebPubSubServiceClient(
    wpsEndpoint,
    credential,
    aiHub
  );

  const getClientAccessUrl = async (_) => {
    return (
      await streamingService.getClientAccessToken({
        //  groups: [groupName],
        roles: [`webpubsub.sendToGroup`, `webpubsub.joinLeaveGroup`], // server has all permissions
      })
    ).url;
  };
  const client = new WebPubSubClient({ getClientAccessUrl });
  await client.start();
  return client;
}
