"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var typegoose_1 = require("@typegoose/typegoose");
var interfaces_1 = require("../../interfaces");
var UserClass = /** @class */ (function () {
    function UserClass() {
    }
    __decorate([
        (0, typegoose_1.prop)({ minlength: 5, maxlength: 20, required: true }),
        __metadata("design:type", String)
    ], UserClass.prototype, "name", void 0);
    __decorate([
        (0, typegoose_1.prop)({ minlength: 5, maxlength: 20, required: true }),
        __metadata("design:type", String)
    ], UserClass.prototype, "lastname", void 0);
    __decorate([
        (0, typegoose_1.prop)({
            match: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            required: true,
            unique: true,
        }),
        __metadata("design:type", String)
    ], UserClass.prototype, "email", void 0);
    __decorate([
        (0, typegoose_1.prop)({ minlength: 7, maxlength: 13, required: true, unique: true }),
        __metadata("design:type", String)
    ], UserClass.prototype, "phoneNumber", void 0);
    __decorate([
        (0, typegoose_1.prop)({ minlength: 5, maxlength: 20, required: true, unique: true }),
        __metadata("design:type", String)
    ], UserClass.prototype, "username", void 0);
    __decorate([
        (0, typegoose_1.prop)({ required: true, unique: true }),
        __metadata("design:type", String)
    ], UserClass.prototype, "password", void 0);
    __decorate([
        (0, typegoose_1.prop)({ default: false }),
        __metadata("design:type", Boolean)
    ], UserClass.prototype, "is_active", void 0);
    __decorate([
        (0, typegoose_1.prop)({ enum: interfaces_1.RolesEnum, default: interfaces_1.RolesEnum.USER }),
        __metadata("design:type", String)
    ], UserClass.prototype, "role", void 0);
    UserClass = __decorate([
        (0, typegoose_1.modelOptions)({
            options: { customName: "UserAuthV2" },
            schemaOptions: { timestamps: true },
        })
    ], UserClass);
    return UserClass;
}());
var UserModel = (0, typegoose_1.getModelForClass)(UserClass);
exports.default = UserModel;
