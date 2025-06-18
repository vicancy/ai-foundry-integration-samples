import "dotenv/config";
import fs from "fs";

// A custom credential is required for use in Azure Cloud Shell but isn't required on your local machine.
class VSCodeCredential {
  async getToken() {
    const token = fs.readFileSync("/tmp/ai_token", "utf8").trim();
    return { token, expiresOnTimestamp: 0 };
  }
}
const credential = new VSCodeCredential();
export default credential;