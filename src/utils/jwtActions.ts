import jwt from "jsonwebtoken";
import {
  secretKEYUserSession,
  secretKEYModeratorSession,
  secretKEYAdminSession,
  secretKEYEmailVerifier,
  expiresSession,
  expiresEmailVerfier,
  expiresResetPass,
  secretKEYResetPass
} from "../config";

type actions = "emailVerifier" | "userSession" | "resetPassword";

export const generateJWT = (
  type: actions,
  data: string,
  role?: string
): string => {
  switch (type) {
    case "userSession":
      const JWTsecretKey =
        role === "ADMIN"
          ? secretKEYAdminSession
          : role === "MODERATOR"
          ? secretKEYModeratorSession
          : secretKEYUserSession;
      return jwt.sign({ data }, JWTsecretKey, {
        expiresIn: expiresSession,
      });
    case "emailVerifier":
      return jwt.sign({ data }, secretKEYEmailVerifier, {
        expiresIn: expiresEmailVerfier,
      });
    case "resetPassword":
      return jwt.sign({ data }, secretKEYResetPass, {
        expiresIn: expiresResetPass,
      });
  }
};

export const decodeJWT = (
  type: actions,
  token: string,
  role?: string
): string | null => {
  try {
    let value: any, secretKey: string;
    switch (type) {
      case "emailVerifier":
        secretKey = secretKEYEmailVerifier;
        break;
      case "resetPassword":
        secretKey = secretKEYResetPass
        break
      case "userSession":
        secretKey =
          role === "ADMIN"
            ? secretKEYAdminSession
            : role === secretKEYModeratorSession
            ? "MODERATOR"
            : secretKEYUserSession;
    }
    jwt.verify(token, secretKey, (_err, decoded) => {
      value = decoded;
    });
    return value.data;
  } catch (error) {
    return null;
  }
};
