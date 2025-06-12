const payload = {
  "baseUrl": "https://k26n7tqv-8080.asse.devtunnels.ms/",
  "indexUrl": "/index.json",
  "variables": {
    "agentId": "asst_dxBHhmWqjIogVyWX7Wb5j7DW",
    "connectionString": "",
    "threadId": "thread_iGgPGzqfmoQI1fq0kHWd0H2U",
    "userMessage": "Hello Agent",
    "playgroundName": "agents-playground-2142",
    "location": "eastus2",
    "subscriptionId": "9caf2a1e-9c49-49b6-89a2-56bdec7e3f97",
    "resourceId": "/subscriptions/9caf2a1e-9c49-49b6-89a2-56bdec7e3f97/resourceGroups/rg-lianwei-2412/providers/Microsoft.CognitiveServices/accounts/lianwei-2412-resource",
    "projectResourceId": "/subscriptions/9caf2a1e-9c49-49b6-89a2-56bdec7e3f97/resourceGroups/rg-lianwei-2412/providers/Microsoft.CognitiveServices/accounts/lianwei-2412-resource/projects/lianwei-2412",
    "endpoint": "https://lianwei-2412-resource.services.ai.azure.com/api/projects/lianwei-2412"
  },
  "codeRoute": [
    "ai-projects-sdk",
    "python",
    "default-azure-auth",
    "endpoint"
  ]
}

console.log(`https://insiders.vscode.dev/azure/?tenantId=72f988bf-86f1-41af-91ab-2d7cd011db47&subscriptionId=9caf2a1e-9c49-49b6-89a2-56bdec7e3f97&vscode-azure-exp=foundry&agentPayload=${btoa(JSON.stringify(payload))}`);