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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var dotenv = __importStar(require("dotenv"));
var connection_1 = __importDefault(require("./db/connection"));
var cookie_parser_1 = __importDefault(require("cookie-parser"));
var cors_1 = __importDefault(require("cors"));
dotenv.config();
var auth_1 = __importDefault(require("./routers/auth"));
var profile_1 = __importDefault(require("./routers/profile"));
var authenticated_1 = require("./middleware/authenticated");
var path_1 = __importDefault(require("path"));
var app = (0, express_1.default)();
var port = +(process.env.PORT || "4000");
// config
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)());
app.set('views', path_1.default.join(__dirname, "..", "public", 'views'));
app.set('view engine', 'ejs');
// db connection
(0, connection_1.default)();
// router
app.use("/", function (_req, res) {
    res.send("App done by Bryan Jesus");
});
app.use("/auth", auth_1.default);
app.use("/profile", authenticated_1.authenticated, profile_1.default);
// server
app.listen(port, function () { return console.log("App running on port " + port); });
