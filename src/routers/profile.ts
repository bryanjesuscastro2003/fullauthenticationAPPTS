import { Router } from "express";
import * as controllers from "../controllers/profileController"

const router =  Router();

router.get("/", controllers.getProfileController)
router.patch("/update/namelastname", controllers.updateDataLevel1)
router.patch("/update/emailphonenumberusername", controllers.updateDataLevel2)
router.patch("/update/password", controllers.updateDataLevel3)

export default router

