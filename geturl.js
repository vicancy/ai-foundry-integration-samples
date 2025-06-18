import "dotenv/config";
const payload = {
  "baseUrl": process.env.BASE_URL,
  "indexUrl": "/index.json",
  "variables": {
    "endpoint": process.env.PROJECT_ENDPOINT,
    "wpsendpoint": process.env.WPS_ENDPOINT,
    "wpsaihub": "ai_sample",
    "modeldeployment": "gpt-4o",
  },
  "codeRoute": [
    "ai-projects-sdk",
    "javascript",
    "default-azure-auth",
    "endpoint"
  ]
}
const tenantId = process.env.TENANT_ID;
const subscriptionId = process.env.SUBSCRIPTION_ID;
console.log(`https://insiders.vscode.dev/azure/?tenantId=${tenantId}&subscriptionId=${subscriptionId}&vscode-azure-exp=foundry&agentPayload=${btoa(JSON.stringify(payload))}`);