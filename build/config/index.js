"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.baseUrl = exports.periodEmailShipments = exports.emailCondig = exports.secretKEYResetPass = exports.secretKEYEmailVerifier = exports.secretKEYAdminSession = exports.secretKEYModeratorSession = exports.secretKEYUserSession = exports.expiresResetPass = exports.expiresEmailVerfier = exports.expiresSession = exports.mongoUrl = void 0;
var dotenv = __importStar(require("dotenv"));
dotenv.config();
exports.mongoUrl = process.env.MONGO_URL;
exports.expiresSession = process.env.EXPIRESSESSION;
exports.expiresEmailVerfier = process.env.EMAILVERIFIEREXPIRESIN;
exports.expiresResetPass = process.env.RESETPASSEXPIRESIN;
exports.secretKEYUserSession = process.env.KEY_USER;
exports.secretKEYModeratorSession = process.env.KEY_MODERATOR;
exports.secretKEYAdminSession = process.env.KEY_ADMIN;
exports.secretKEYEmailVerifier = process.env.KEY_EMAILVERIFIER;
exports.secretKEYResetPass = process.env.KEY_RESETPASSWORD;
exports.emailCondig = {
    PORT: +(process.env.PORTEMAIL),
    HOST: process.env.HOST,
    USER: process.env.USER,
    PASS: process.env.PASS
};
exports.periodEmailShipments = process.env.PERIOD_EMAIL_VALIDATOR || "180000";
exports.baseUrl = process.env.BASE_URL;
