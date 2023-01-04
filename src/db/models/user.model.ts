import { getModelForClass, modelOptions, prop } from "@typegoose/typegoose";
import { RolesEnum } from "../../interfaces";

@modelOptions({
  options: { customName: "UserAuthV2" },
  schemaOptions: { timestamps: true },
})
class UserClass {
  @prop({ minlength: 5, maxlength: 20, required: true })
  public name!: string;

  @prop({ minlength: 5, maxlength: 20, required: true })
  public lastname!: string;

  @prop({
    match: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
    required: true,
    unique: true,
  })
  public email!: string;

  @prop({ minlength: 7, maxlength: 13, required: true, unique: true })
  public phoneNumber!: string;

  @prop({ minlength: 5, maxlength: 20, required: true, unique: true })
  public username!: string;

  @prop({ required: true, unique: true })
  public password!: string;

  @prop({ default: false })
  public is_active?: boolean;

  @prop({ enum: RolesEnum, default: RolesEnum.USER })
  public role!: string;
}

const UserModel = getModelForClass(UserClass);
export default UserModel;
