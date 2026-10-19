import express from "express"
import { agent } from "../controller/agent.controller.ts";

const router = express.Router();

router.post("/chat" , agent);

export default router