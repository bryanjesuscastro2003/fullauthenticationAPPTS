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
exports.updateDataLevel3 = exports.updateDataLevel2 = exports.updateDataLevel1 = exports.getProfileController = void 0;
var dataValidator_1 = require("../utils/dataValidator");
var user_model_1 = __importDefault(require("../db/models/user.model"));
var emailActions_1 = __importDefault(require("../utils/emailActions"));
var jwtActions_1 = require("../utils/jwtActions");
var bcrypt_1 = __importDefault(require("bcrypt"));
var getProfileController = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2 /*return*/, res.status(200).json({
                ok: true,
                message: "Logged in successfully",
                user: req.user,
            })];
    });
}); };
exports.getProfileController = getProfileController;
// name - lastname
var updateDataLevel1 = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var errorObj, params, dataFormat_1, dataValidated1, error_1, errorObj, message, sintaxData;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                errorObj = void 0;
                params = ["name", "lastname"];
                if (![req.body.name, req.body.lastname].every(Boolean)) {
                    errorObj = {
                        type: "incomplete",
                        error: "".concat(params, " are required"),
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
                return [4 /*yield*/, user_model_1.default.findOneAndUpdate({ _id: req.user._id }, { name: req.body.name, lastname: req.body.lastname })];
            case 1:
                _a.sent();
                return [2 /*return*/, res.status(200).json({
                        ok: true,
                        message: "Data updated successfully",
                        error: {
                            sintaxData: [],
                        },
                    })];
            case 2:
                error_1 = _a.sent();
                try {
                    errorObj = void 0;
                    if (error_1 instanceof Error)
                        errorObj = JSON.parse(error_1.message);
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
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.updateDataLevel1 = updateDataLevel1;
// email - phonenumber - username
var updateDataLevel2 = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var errorObj, emailWorker, params, dataFormat_2, dataValidated1, validations, tempCounter, emailModified, dataValidated2, token, userUpdated, error_2, errorObj, message, sintaxData, unavailableData;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 5, , 6]);
                errorObj = void 0;
                emailWorker = new emailActions_1.default();
                params = ["email", "phoneNumber", "username"];
                if (![req.body.email, req.body.phoneNumber, req.body.username].every(Boolean)) {
                    errorObj = {
                        type: "incomplete",
                        error: "".concat(params, " are required"),
                    };
                    throw new Error(JSON.stringify(errorObj));
                }
                dataFormat_2 = [];
                params.map(function (pr, i) {
                    dataFormat_2.push({
                        name: Object.keys(req.body)[i],
                        value: req.body[pr],
                    });
                });
                dataValidated1 = (0, dataValidator_1.dataValidator)(dataFormat_2).filter(function (clc) { return clc.name !== undefined; });
                if (dataValidated1.filter(function (dt) { return dt.status === false; }).length) {
                    errorObj = { type: "sintax", error: JSON.stringify(dataValidated1) };
                    throw new Error(JSON.stringify(errorObj));
                }
                validations = [];
                tempCounter = 0, emailModified = false;
                if (req.user.email !== req.body.email) {
                    validations.push({
                        name: "email",
                        value: req.body.email,
                    });
                    tempCounter++;
                    emailModified = true;
                }
                if (req.user.phoneNumber !== req.body.phoneNumber) {
                    validations.push({
                        name: "phoneNumber",
                        value: req.body.phoneNumber,
                    });
                    tempCounter++;
                }
                if (req.user.username !== req.body.username) {
                    validations.push({
                        name: "username",
                        value: req.body.username,
                    });
                    tempCounter++;
                }
                if (!(tempCounter !== 0)) return [3 /*break*/, 4];
                return [4 /*yield*/, (0, dataValidator_1.validateUniqueData)({
                        values: validations,
                    })];
            case 1:
                dataValidated2 = _a.sent();
                if (dataValidated2.filter(function (df) { return df.available === false; }).length) {
                    errorObj = {
                        type: "unavailable",
                        error: JSON.stringify(dataValidated2),
                    };
                    throw new Error(JSON.stringify(errorObj));
                }
                token = (0, jwtActions_1.generateJWT)("emailVerifier", req.user._id);
                return [4 /*yield*/, user_model_1.default.findOneAndUpdate({ _id: req.user._id }, {
                        username: req.body.username,
                        phoneNumber: req.body.phoneNumber,
                        email: req.body.email,
                        is_active: emailModified ? false : true,
                    }, { new: true })];
            case 2:
                userUpdated = _a.sent();
                if (userUpdated === null) {
                    errorObj = {
                        type: "incomplete",
                        error: "User not found please restart your session",
                    };
                    throw new Error(JSON.stringify(errorObj));
                }
                if (!emailModified) return [3 /*break*/, 4];
                return [4 /*yield*/, emailWorker.sendEmailVerifier(userUpdated, token)];
            case 3:
                _a.sent();
                _a.label = 4;
            case 4: return [2 /*return*/, res.status(200).json({
                    ok: true,
                    message: emailModified
                        ? "Data updated please verify your account with the email just send to your mailbox"
                        : "Data updated successfully",
                    error: {
                        sintaxData: [],
                        unavailableData: [],
                    },
                })];
            case 5:
                error_2 = _a.sent();
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
exports.updateDataLevel2 = updateDataLevel2;
// password
var updateDataLevel3 = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, error_3;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 3, , 4]);
                if (![req.body.newpassword].every(Boolean))
                    throw new Error("Password is required");
                if (typeof req.body.newpassword !== "string")
                    throw new Error("Password must be string");
                if (req.body.newpassword.length < 8)
                    throw new Error("Invalid Password at least 8 characters long");
                _a = req.body;
                return [4 /*yield*/, bcrypt_1.default.hash(req.body.newpassword, 10)];
            case 1:
                _a.newpassword = _b.sent();
                return [4 /*yield*/, user_model_1.default.findOneAndUpdate({ _id: req.user._id }, { password: req.body.newpassword })];
            case 2:
                _b.sent();
                return [2 /*return*/, res.status(200).json({
                        ok: true,
                        message: "Data updated successfully",
                        error: {
                            sintaxData: [],
                        },
                    })];
            case 3:
                error_3 = _b.sent();
                return [2 /*return*/, res.status(400).json({
                        ok: true,
                        message: "Error sintax data",
                        error: {
                            sintaxData: [
                                {
                                    name: "password",
                                    status: false,
                                    error: "Password : ".concat(error_3 instanceof Error
                                        ? error_3.message
                                        : "Server error try again later"),
                                },
                            ],
                        },
                    })];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.updateDataLevel3 = updateDataLevel3;
