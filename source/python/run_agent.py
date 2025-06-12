from typing import Optional
from azure.core.credentials import AccessToken
from azure.ai.projects import AIProjectClient
from azure.ai.agents.models import ListSortOrder

# A custom credential is required for use in Azure Cloud Shell but isn't required on your local machine.
class VSCodeCredential(object):
    def get_token(
        self, *scopes: str, claims: Optional[str] = None, tenant_id: Optional[str] = None, **kwargs
    ) -> AccessToken:
        with open("/tmp/ai_token", "r") as file:
            token = file.read().strip()
            return AccessToken(token, expires_on=0)

project = AIProjectClient(
    credential=VSCodeCredential(),
    endpoint="https://lianwei-2412-resource.services.ai.azure.com/api/projects/lianwei-2412")

agent = project.agents.get_agent("asst_dxBHhmWqjIogVyWX7Wb5j7DW")

thread = project.agents.threads.get("thread_iGgPGzqfmoQI1fq0kHWd0H2U")

message = project.agents.messages.create(
    thread_id=thread.id,
    role="user",
    content="Hello Agent"
)

run = project.agents.runs.create_and_process(
    thread_id=thread.id,
    agent_id=agent.id)

if run.status == "failed":
    print(f"Run failed: {run.last_error}")
else:
    messages = project.agents.messages.list(thread_id=thread.id, order=ListSortOrder.ASCENDING)

    for message in messages:
        if message.text_messages:
            print(f"{message.role}: {message.text_messages[-1].text.value}")