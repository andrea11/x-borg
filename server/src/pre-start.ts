import * as dotenv from "dotenv"
import { fileURLToPath } from "url";
import { dirname } from "path";
import * as path from "path";

const __filename = fileURLToPath(import.meta.url);
const currentFolder = dirname(__filename);
dotenv.config({ path: path.join(currentFolder, "../../.env") })