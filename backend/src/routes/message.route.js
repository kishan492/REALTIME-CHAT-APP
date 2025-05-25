import express from "express"
const router = express.Router()
import { protectRouter } from "../middleware/auth.middleware.js";
import { getUserForSidebar ,getMessages ,sendMessage} from "../controllers/message.controller.js";

router.get("/users",protectRouter,getUserForSidebar)
router.get("/:id",protectRouter,getMessages)
router.post("/send/:id",protectRouter,sendMessage)
export default router;