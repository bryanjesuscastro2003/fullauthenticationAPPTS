import cors from "cors";
import { Router } from "express";
import * as controllers from "../controllers/authController";

const router = Router();

router.post("/login", controllers.loginController);
router.post("/logup", controllers.logupController);
router.get("/activator/:token", controllers.activatorController);
router.get("/activator/back/:email", controllers.emailValidatorBackController);

router.post("/forget/password/st1", controllers.forgetPasswordStep1);
router.get("/forget/password/st2/:token", controllers.forgetPasswordStep2);
router.post("/forget/password/st3", controllers.forgetPasswordStep3);

export default router;
