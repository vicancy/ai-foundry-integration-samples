import { AIProjectClient } from "@azure/ai-projects";
import fs from "fs"; 

// A custom credential is required for use in Azure Cloud Shell but isn't required on your local machine.
class VSCodeCredential {
  async getToken() {
    const token = fs.readFileSync("/tmp/ai_token", "utf8").trim();
    return { token, expiresOnTimestamp: 0 };
  }
}

async function runAgentConversation() {
  const project = new AIProjectClient(
    "<%= endpoint %>",
    new VSCodeCredential());

  const agent = await project.agents.getAgent("<%= agentId %>");
  console.log(`Retrieved agent: ${agent.name}`);

  const thread = await project.agents.threads.get("<%= threadId %>");
  console.log(`Retrieved thread, thread ID: ${thread.id}`);

  const message = await project.agents.messages.create(thread.id, "user", "<%= userMessage %>");
  console.log(`Created message, message ID: ${message.id}`);

  // Create run
  let run = await project.agents.runs.create(thread.id, agent.id);

  // Poll until the run reaches a terminal status
  while (run.status === "queued" || run.status === "in_progress") {
    // Wait for a second
    await new Promise((resolve) => setTimeout(resolve, 1000));
    run = await project.agents.runs.get(thread.id, run.id);
  }

  if (run.status === "failed") {
    console.error(`Run failed: `, run.lastError);
  }

  console.log(`Run completed with status: ${run.status}`);

  // Retrieve messages
  const messages = await project.agents.messages.list(thread.id, { order: "asc" });

  // Display messages
  for await (const m of messages) {
    const content = m.content.find((c) => c.type === "text" && "text" in c);
    if (content) {
      console.log(`${m.role}: ${content.text.value}`);
    }
  }
}

// Main execution
runAgentConversation().catch(error => {
  console.error("An error occurred:", error);
});