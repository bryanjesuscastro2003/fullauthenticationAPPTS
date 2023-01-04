import * as dotenv from 'dotenv'
dotenv.config()
import {EmailConfig} from "../types"

export const mongoUrl : string = process.env.MONGO_URL!    

export const expiresSession : string = process.env.EXPIRESSESSION!
export const expiresEmailVerfier : string = process.env.EMAILVERIFIEREXPIRESIN!
export const expiresResetPass : string = process.env.RESETPASSEXPIRESIN!
export const secretKEYUserSession : string = process.env.KEY_USER!
export const secretKEYModeratorSession : string = process.env.KEY_MODERATOR!
export const secretKEYAdminSession : string = process.env.KEY_ADMIN!
export const secretKEYEmailVerifier : string = process.env.KEY_EMAILVERIFIER!
export const secretKEYResetPass : string = process.env.KEY_RESETPASSWORD!

export const emailCondig : EmailConfig = {
    PORT : +(process.env.PORTEMAIL!) ,
    HOST : process.env.HOST!,
    USER : process.env.USER!,
    PASS : process.env.PASS!
}

export const periodEmailShipments : string = process.env.PERIOD_EMAIL_VALIDATOR || "180000"
export const baseUrl : string = process.env.BASE_URL! 