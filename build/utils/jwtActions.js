"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.decodeJWT = exports.generateJWT = void 0;
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var config_1 = require("../config");
var generateJWT = function (type, data, role) {
    switch (type) {
        case "userSession":
            var JWTsecretKey = role === "ADMIN"
                ? config_1.secretKEYAdminSession
                : role === "MODERATOR"
                    ? config_1.secretKEYModeratorSession
                    : config_1.secretKEYUserSession;
            return jsonwebtoken_1.default.sign({ data: data }, JWTsecretKey, {
                expiresIn: config_1.expiresSession,
            });
        case "emailVerifier":
            return jsonwebtoken_1.default.sign({ data: data }, config_1.secretKEYEmailVerifier, {
                expiresIn: config_1.expiresEmailVerfier,
            });
        case "resetPassword":
            return jsonwebtoken_1.default.sign({ data: data }, config_1.secretKEYResetPass, {
                expiresIn: config_1.expiresResetPass,
            });
    }
};
exports.generateJWT = generateJWT;
var decodeJWT = function (type, token, role) {
    try {
        var value_1, secretKey = void 0;
        switch (type) {
            case "emailVerifier":
                secretKey = config_1.secretKEYEmailVerifier;
                break;
            case "resetPassword":
                secretKey = config_1.secretKEYResetPass;
                break;
            case "userSession":
                secretKey =
                    role === "ADMIN"
                        ? config_1.secretKEYAdminSession
                        : role === config_1.secretKEYModeratorSession
                            ? "MODERATOR"
                            : config_1.secretKEYUserSession;
        }
        jsonwebtoken_1.default.verify(token, secretKey, function (_err, decoded) {
            value_1 = decoded;
        });
        return value_1.data;
    }
    catch (error) {
        return null;
    }
};
exports.decodeJWT = decodeJWT;
