import "dotenv/config";
import { DefaultAzureCredential } from "@azure/identity";

const credential = new DefaultAzureCredential();
export default credential;