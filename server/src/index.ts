import "./pre-start";
import server from "./server";
import { env } from "@/env.mjs";


// **** Run **** //

const SERVER_START_MSG = (`Express server started on port: ${env.NODE_PORT} in ${env.NODE_ENV} mode`);

server.listen(env.NODE_PORT, () => console.info(SERVER_START_MSG));