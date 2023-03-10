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
var config_1 = require("../config");
var nodemailer_1 = __importDefault(require("nodemailer"));
var nodemailer_express_handlebars_1 = __importDefault(require("nodemailer-express-handlebars"));
var path_1 = __importDefault(require("path"));
var EmailActions = /** @class */ (function () {
    function EmailActions() {
        var _this = this;
        this.setMailer = function (addressee, subject, template, title, code, link) {
            return {
                from: "\"Join Tec \uD83D\uDC7B\" <".concat(_this._emailConfig.USER, ">"),
                to: "".concat(addressee.email),
                subject: subject,
                template: template,
                context: {
                    title: title,
                    username: addressee.username,
                    email: addressee.email,
                    code: code,
                    link: link,
                    possible_mistake: "If your are not the user,  just ignore this email thanks",
                },
            };
        };
        this.sendEmailVerifier = function (data, token) { return __awaiter(_this, void 0, void 0, function () {
            var info, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        info = this.setMailer(data, "Hi, this is the email verifier ???", "Emailverifier", "Please confirm your Account pressing the link down below limit 3 min", undefined, "http://".concat(this._baseUrl, "/auth/activator/").concat(token));
                        return [4 /*yield*/, this._transporter.sendMail(info)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, true];
                    case 2:
                        error_1 = _a.sent();
                        throw error_1;
                    case 3: return [2 /*return*/];
                }
            });
        }); };
        this.sendResetPasswordCode = function (data, token) { return __awaiter(_this, void 0, void 0, function () {
            var info, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        info = this.setMailer(data, "Hi, this is the reset password code ???", "Emailverifier", "Push on the link down bellow to update your password limit 3 min ", undefined, "http://".concat(this._baseUrl, "/auth/forget/password/st2/").concat(token));
                        return [4 /*yield*/, this._transporter.sendMail(info)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, true];
                    case 2:
                        error_2 = _a.sent();
                        throw error_2;
                    case 3: return [2 /*return*/];
                }
            });
        }); };
        this._emailConfig = config_1.emailCondig;
        this._baseUrl = config_1.baseUrl;
        this._transporter = nodemailer_1.default.createTransport({
            host: this._emailConfig.HOST,
            port: this._emailConfig.PORT,
            secure: false,
            auth: {
                user: this._emailConfig.USER,
                pass: this._emailConfig.PASS,
            },
        });
        this._handleOptions = {
            viewEngine: {
                extname: ".handlebars",
                layoutsDir: path_1.default.resolve("./public/views"),
                defaultLayout: false, // name of main template
            },
            viewPath: path_1.default.resolve("./public/views"),
            extName: ".handlebars",
        };
        this._transporter.use("compile", (0, nodemailer_express_handlebars_1.default)(this._handleOptions));
    }
    return EmailActions;
}());
exports.default = EmailActions;
