"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.forgetPasswordStep3 = exports.forgetPasswordStep2 = exports.forgetPasswordStep1 = exports.emailValidatorBackController = exports.activatorController = exports.logupController = exports.loginController = void 0;
var bcrypt_1 = __importDefault(require("bcrypt"));
var user_model_1 = __importDefault(require("../db/models/user.model"));
var dataValidator_1 = require("../utils/dataValidator");
var emailActions_1 = __importDefault(require("../utils/emailActions"));
var jwtActions_1 = require("../utils/jwtActions");
var config_1 = require("../config");
var loginController = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user, token, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                if (![req.body.username, req.body.password].every(Boolean))
                    throw new Error("Username and password required");
                return [4 /*yield*/, user_model_1.default.findOne({
                        username: req.body.username,
                    })];
            case 1:
                user = _a.sent();
                if (user === null)
                    throw new Error("Such account is not available");
                if (!user.is_active)
                    throw new Error("Please verify your account before login");
                return [4 /*yield*/, bcrypt_1.default.compare(req.body.password, user.password)];
            case 2:
                if (!(_a.sent()))
                    throw new Error("Your password is incorrect");
                token = (0, jwtActions_1.generateJWT)("userSession", user._id, user.role);
                return [2 /*return*/, res.status(200).json({
                        ok: true,
                        message: "Logged in successfully",
                        jwt: token,
                    })];
            case 3:
                error_1 = _a.sent();
                return [2 /*return*/, res.status(400).json({
                        ok: false,
                        message: error_1 instanceof Error
                            ? error_1.message
                            : "Unexpected error try again later :(",
                        jwt: null,
                    })];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.loginController = loginController;
var logupController = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var emailWorker, params, errorObj, dataFormat_1, dataValidated1, dataValidated2, _a, myUser, token, error_2, errorObj, message, sintaxData, unavailableData;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 5, , 6]);
                emailWorker = new emailActions_1.default();
                params = [
                    "name",
                    "lastname",
                    "email",
                    "phoneNumber",
                    "username",
                    "password",
                    "role",
                ];
                errorObj = void 0;
                if (![
                    req.body.name,
                    req.body.lastname,
                    req.body.email,
                    req.body.phoneNumber,
                    req.body.username,
                    req.body.password,
                ].every(Boolean)) {
                    errorObj = {
                        type: "incomplete",
                        error: "".concat(params.filter(function (pr) { return pr !== "role"; }), " are required"),
                    };
                    throw new Error(JSON.stringify(errorObj));
                }
                dataFormat_1 = [];
                params.map(function (pr, i) {
                    dataFormat_1.push({
                        name: Object.keys(req.body)[i],
                        value: req.body[pr],
                    });
                });
                dataValidated1 = (0, dataValidator_1.dataValidator)(dataFormat_1).filter(function (clc) { return clc.name !== undefined; });
                if (dataValidated1.filter(function (dt) { return dt.status === false; }).length) {
                    errorObj = { type: "sintax", error: JSON.stringify(dataValidated1) };
                    throw new Error(JSON.stringify(errorObj));
                }
                return [4 /*yield*/, (0, dataValidator_1.validateUniqueData)({
                        values: [
                            {
                                name: "email",
                                value: req.body.email,
                            },
                            {
                                name: "phoneNumber",
                                value: req.body.phoneNumber,
                            },
                            {
                                name: "username",
                                value: req.body.username,
                            },
                        ],
                    })];
            case 1:
                dataValidated2 = _b.sent();
                if (dataValidated2.filter(function (df) { return df.available === false; }).length) {
                    errorObj = { type: "unavailable", error: JSON.stringify(dataValidated2) };
                    throw new Error(JSON.stringify(errorObj));
                }
                _a = req.body;
                return [4 /*yield*/, bcrypt_1.default.hash(req.body.password, 10)];
            case 2:
                _a.password = _b.sent();
                return [4 /*yield*/, user_model_1.default.create(req.body)];
            case 3:
                myUser = _b.sent();
                token = (0, jwtActions_1.generateJWT)("emailVerifier", myUser._id);
                return [4 /*yield*/, emailWorker.sendEmailVerifier(myUser, token)];
            case 4:
                _b.sent();
                return [2 /*return*/, res.status(201).json({
                        ok: true,
                        message: "Account created successfully but its not active please verify your account with the email just send to your mailbox",
                        error: {
                            sintaxData: [],
                            unavailableData: [],
                        },
                    })];
            case 5:
                error_2 = _b.sent();
                try {
                    errorObj = void 0;
                    if (error_2 instanceof Error)
                        errorObj = JSON.parse(error_2.message);
                    message = errorObj.type === "incomplete"
                        ? errorObj.error
                        : errorObj.type === "sintax"
                            ? "Error sintax data"
                            : "Error unavailable data";
                    sintaxData = errorObj.type === "sintax" ? JSON.parse(errorObj.error) : [];
                    unavailableData = errorObj.type === "unavailable" ? JSON.parse(errorObj.error) : [];
                    return [2 /*return*/, res.status(400).json({
                            ok: false,
                            message: message,
                            error: {
                                sintaxData: sintaxData,
                                unavailableData: unavailableData,
                            },
                        })];
                }
                catch (error) {
                    return [2 /*return*/, res.status(500).send("Server error try again later :/")];
                }
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); };
exports.logupController = logupController;
var activatorController = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var secretValue, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                if (!req.params.token)
                    throw new Error("Token no provided");
                secretValue = (0, jwtActions_1.decodeJWT)("emailVerifier", req.params.token);
                if (secretValue === null)
                    throw new Error("Invalid token please generate one more");
                return [4 /*yield*/, user_model_1.default.findOneAndUpdate({ _id: secretValue }, { is_active: true })];
            case 1:
                _a.sent();
                return [2 /*return*/, res.status(200).send("Account activated successfully")];
            case 2:
                error_3 = _a.sent();
                return [2 /*return*/, res
                        .status(400)
                        .send("".concat(error_3 instanceof Error
                        ? error_3.message
                        : "Unexpected error try again later. "))];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.activatorController = activatorController;
var emailValidatorBackController = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var emailWorker, errorObj, dataValidated1, user, interval, dateNow, token, error_4, errorObj, message, sintaxData;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 6, , 7]);
                emailWorker = new emailActions_1.default();
                errorObj = void 0;
                if (!req.params.email) {
                    errorObj = {
                        type: "incomplete",
                        error: "Account email is required",
                    };
                    throw new Error(JSON.stringify(errorObj));
                }
                dataValidated1 = (0, dataValidator_1.dataValidator)([
                    {
                        name: "email",
                        value: req.params.email,
                    },
                ]).filter(function (clc) { return clc.name !== undefined; });
                if (dataValidated1.filter(function (dt) { return dt.status === false; }).length) {
                    errorObj = { type: "sintax", error: JSON.stringify(dataValidated1) };
                    throw new Error(JSON.stringify(errorObj));
                }
                return [4 /*yield*/, user_model_1.default.findOne({
                        email: req.params.email,
                        is_active: false,
                    })];
            case 1:
                user = _a.sent();
                if (user === null) {
                    errorObj = { type: "incomplete", error: "Such account is not available" };
                    throw new Error(JSON.stringify(errorObj));
                }
                interval = +config_1.periodEmailShipments / 60000;
                dateNow = new Date();
                dateNow.setMinutes(dateNow.getMinutes() - interval);
                if (!(new Date(user.updatedAt) < dateNow)) return [3 /*break*/, 4];
                token = (0, jwtActions_1.generateJWT)("emailVerifier", user._id);
                return [4 /*yield*/, emailWorker.sendEmailVerifier(user, token)];
            case 2:
                _a.sent();
                return [4 /*yield*/, user_model_1.default.findOneAndUpdate({ _id: user._id }, { name: user.name })];
            case 3:
                _a.sent(); // to refresh timestamp
                return [3 /*break*/, 5];
            case 4:
                errorObj = {
                    type: "incomplete",
                    error: "Validator not send , please wait ".concat(new Date(user.updatedAt).getMinutes() + 1 - dateNow.getMinutes(), " Minutes"),
                };
                throw new Error(JSON.stringify(errorObj));
            case 5: return [2 /*return*/, res.status(200).json({
                    ok: true,
                    message: "Email validator just send to your email address limit 3 min",
                    error: {
                        sintaxData: [],
                    },
                })];
            case 6:
                error_4 = _a.sent();
                try {
                    errorObj = void 0;
                    if (error_4 instanceof Error)
                        errorObj = JSON.parse(error_4.message);
                    message = errorObj.type === "incomplete"
                        ? errorObj.error
                        : errorObj.type === "sintax"
                            ? "Error sintax data"
                            : "Error unavailable data";
                    sintaxData = errorObj.type === "sintax" ? JSON.parse(errorObj.error) : [];
                    return [2 /*return*/, res.status(400).json({
                            ok: false,
                            message: message,
                            error: {
                                sintaxData: sintaxData,
                            },
                        })];
                }
                catch (error) {
                    return [2 /*return*/, res.status(500).send("Server error try again later :/")];
                }
                return [3 /*break*/, 7];
            case 7: return [2 /*return*/];
        }
    });
}); };
exports.emailValidatorBackController = emailValidatorBackController;
var forgetPasswordStep1 = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var emailWorker, errorObj, dataValidated1, user, interval, dateNow, token, error_5, errorObj, message, sintaxData;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 6, , 7]);
                emailWorker = new emailActions_1.default();
                errorObj = void 0;
                if (!req.body.email) {
                    errorObj = {
                        type: "incomplete",
                        error: "Account email is required",
                    };
                    throw new Error(JSON.stringify(errorObj));
                }
                dataValidated1 = (0, dataValidator_1.dataValidator)([
                    {
                        name: "email",
                        value: req.body.email,
                    },
                ]).filter(function (clc) { return clc.name !== undefined; });
                if (dataValidated1.filter(function (dt) { return dt.status === false; }).length) {
                    errorObj = { type: "sintax", error: JSON.stringify(dataValidated1) };
                    throw new Error(JSON.stringify(errorObj));
                }
                return [4 /*yield*/, user_model_1.default.findOne({ email: req.body.email })];
            case 1:
                user = _a.sent();
                if (user === null) {
                    errorObj = { type: "incomplete", error: "Such account is not available" };
                    throw new Error(JSON.stringify(errorObj));
                }
                interval = +config_1.periodEmailShipments / 60000;
                dateNow = new Date();
                dateNow.setMinutes(dateNow.getMinutes() - interval);
                if (!(new Date(user.updatedAt) < dateNow)) return [3 /*break*/, 4];
                token = (0, jwtActions_1.generateJWT)("resetPassword", user._id);
                return [4 /*yield*/, emailWorker.sendResetPasswordCode(user, token)];
            case 2:
                _a.sent();
                return [4 /*yield*/, user_model_1.default.findOneAndUpdate({ _id: user._id }, { name: user.name })];
            case 3:
                _a.sent(); // to refresh timestamp
                return [3 /*break*/, 5];
            case 4:
                errorObj = {
                    type: "incomplete",
                    error: "ResetPassword not send , please wait ".concat(new Date(user.updatedAt).getMinutes() + 1 - dateNow.getMinutes(), " Minutes"),
                };
                throw new Error(JSON.stringify(errorObj));
            case 5: return [2 /*return*/, res.status(200).json({
                    ok: true,
                    message: "Reset password just send to your email address lim 3 min",
                    error: {
                        sintaxData: [],
                    },
                })];
            case 6:
                error_5 = _a.sent();
                try {
                    errorObj = void 0;
                    if (error_5 instanceof Error)
                        errorObj = JSON.parse(error_5.message);
                    message = errorObj.type === "incomplete"
                        ? errorObj.error
                        : errorObj.type === "sintax"
                            ? "Error sintax data"
                            : "Error unavailable data";
                    sintaxData = errorObj.type === "sintax" ? JSON.parse(errorObj.error) : [];
                    return [2 /*return*/, res.status(400).json({
                            ok: false,
                            message: message,
                            error: {
                                sintaxData: sintaxData,
                            },
                        })];
                }
                catch (error) {
                    return [2 /*return*/, res.status(500).send("Server error try again later :/")];
                }
                return [3 /*break*/, 7];
            case 7: return [2 /*return*/];
        }
    });
}); };
exports.forgetPasswordStep1 = forgetPasswordStep1;
var forgetPasswordStep2 = function (req, res) {
    if (!req.params.token)
        res.send("Error server");
    else
        res.render("UpdatePassword", { token: req.params.token });
};
exports.forgetPasswordStep2 = forgetPasswordStep2;
var forgetPasswordStep3 = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var data, _a, error_6;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 3, , 4]);
                if (![req.body.tk, req.body.pass1, req.body.pass2])
                    throw new Error("Incomplete data");
                if (typeof req.body.pass1 !== "string")
                    throw new Error("Password must be string");
                if (req.body.pass1 !== req.body.pass2)
                    throw new Error("Password does not match");
                if (req.body.pass1.length < 8)
                    throw new Error("Invalid Password at least 8 characters long");
                data = (0, jwtActions_1.decodeJWT)("resetPassword", req.body.tk);
                if (data === null)
                    throw new Error("Invalid token please generate a new one");
                _a = req.body;
                return [4 /*yield*/, bcrypt_1.default.hash(req.body.pass1, 10)];
            case 1:
                _a.pass1 = _b.sent();
                return [4 /*yield*/, user_model_1.default.findOneAndUpdate({ _id: data }, { password: req.body.pass1 })];
            case 2:
                _b.sent();
                res.send("Account password updated successfully");
                return [3 /*break*/, 4];
            case 3:
                error_6 = _b.sent();
                res
                    .status(400)
                    .send(error_6 instanceof Error ? error_6.message : "Server error try again later");
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.forgetPasswordStep3 = forgetPasswordStep3;
