import express, { Application } from "express";
import * as dotenv from "dotenv";
import dbConnection from "./db/connection";
import cookieParser from "cookie-parser"
import cors from "cors"
dotenv.config();

import authRouter from "./routers/auth";
import profileRouter from "./routers/profile";

import {authenticated} from "./middleware/authenticated"
import path from "path";

const app: Application = express();
const port: number = +(process.env.PORT || "4000");

// config
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors())
app.set('views', path.join(__dirname, "..", "public",'views'));
app.set('view engine', 'ejs');


// db connection
dbConnection();

// router
app.use("/auth", authRouter);
app.use("/profile", authenticated, profileRouter);

// server
app.listen(port, () => console.log("App running on port " + port));
