import express  from "express";
import  {protectRouter} from "../middleware/auth.middleware.js";
import { signup,login,logout,updateProfile,checkAuth } from "../controllers/auth.controller.js";
const router = express.Router()

router.post("/signup", signup)
router.post("/login", login)
router.post("/logout",logout)

router.put("/update-profile", protectRouter,updateProfile)
router.get("/check",protectRouter,checkAuth)

export default router;