import { NextFunction, Request, Response } from "express";
import { UserModelInterface } from "../interfaces";
import { decodeJWT } from "../utils/jwtActions";
import UserTable from "../db/models/user.model"

export const authenticated = async (
    req: Request,
    res: Response,
    next: NextFunction
) : Promise<void>=> {
         try {
            if (!Boolean(req.headers?.authorization))
            throw new Error("Session is required");
          let token: string = "";
          if (req.headers.authorization!.startsWith("Bearer ")) {
            token = req.headers.authorization!.substring(
              7,
              req.headers.authorization!.length
            );
          } else throw new Error("Your session is invalid");
          const secretValue: string | null = decodeJWT("userSession", token);
          if (secretValue === null)
            throw new Error("Invalid session your token is not valid");
          const user: UserModelInterface | null =
            await UserTable.findOne<UserModelInterface>({ _id: secretValue, is_active : true }).select({
              password: 0,
              is_active: 0,
              createdAt: 0,
              updatedAt: 0,
              __v: 0,
            });
          if (user === null)
            throw new Error(
              "Your account is not available in this moment restart your session"
            );
            req.user = user
            next()
         } catch (error) {
           res.status(400).json({
            ok: false,
            message:
              error instanceof Error
                ? error.message
                : "Unexpected error starting session please try again later",
            user: null,
          });
         }
}