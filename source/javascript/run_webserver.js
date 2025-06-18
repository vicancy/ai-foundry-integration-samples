import { WebPubSubServiceClient } from "@azure/web-pubsub";
import { DefaultAzureCredential } from "@azure/identity";
import { createAgentService } from "./run_agent.js";
import express from "express";
import 'dotenv/config';
import credential from "./credential.js";

const wpsEndpoint = process.env.WPS_ENDPOINT;
const aiHub = process.env.WPS_AIHUB;

const port = 8088;
const app = express();
const service = new WebPubSubServiceClient(wpsEndpoint, credential, aiHub);
app.use(express.static("."));

const agent = await createAgentService();

app.get("/negotiate", async (req, res) => {
  try {
    const roomId = req.query.roomId;
    await agent.startChat(roomId);
    // communicate userId to agent through agent-controller group
    const token = await service.getClientAccessToken({
      groups: [roomId],
      roles: [`webpubsub.sendToGroup.${roomId}`],
    });
    res.status(200).send(token.url);
  } catch (error) {
    console.error("Negotiation error:", error);
    res.status(500).send({
      error: "Failed to generate client access token",
      message: error.message
    });
  }
});

app.listen(port, () => console.log(`web server started. http://localhost:${port}`));