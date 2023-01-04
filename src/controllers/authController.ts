import { Response, Request } from "express";
import bcrypt from "bcrypt";
import UserTable from "../db/models/user.model";
import { UserModelInterface } from "../interfaces";
import { dataValidator, validateUniqueData } from "../utils/dataValidator";
import { inputData } from "../types";
import EmailActions from "../utils/emailActions";
import { generateJWT, decodeJWT } from "../utils/jwtActions";
import { periodEmailShipments } from "../config";

export const loginController = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    if (![req.body.username, req.body.password].every(Boolean))
      throw new Error("Username and password required");
    const user: UserModelInterface | null =
      await UserTable.findOne<UserModelInterface>({
        username: req.body.username,
      });
    if (user === null) throw new Error("Such account is not available");
    if (!user.is_active!)
      throw new Error("Please verify your account before login");
    if (!(await bcrypt.compare(req.body.password, user.password)))
      throw new Error("Your password is incorrect");
    const token = generateJWT("userSession", user._id!, user.role!);
    return res.status(200).json({
      ok: true,
      message: "Logged in successfully",
      jwt: token,
    });
  } catch (error) {
    return res.status(400).json({
      ok: false,
      message:
        error instanceof Error
          ? error.message
          : "Unexpected error try again later :(",
      jwt: null,
    });
  }
};

export const logupController = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const emailWorker = new EmailActions();
    const params = [
      "name",
      "lastname",
      "email",
      "phoneNumber",
      "username",
      "password",
      "role",
    ];
    let errorObj: {
      type: "incomplete" | "sintax" | "unavailable";
      error: string;
    };
    if (
      ![
        req.body.name,
        req.body.lastname,
        req.body.email,
        req.body.phoneNumber,
        req.body.username,
        req.body.password,
      ].every(Boolean)
    ) {
      errorObj = {
        type: "incomplete",
        error: `${params.filter((pr) => pr !== "role")} are required`,
      };
      throw new Error(JSON.stringify(errorObj));
    }
    let dataFormat: inputData = [];
    params.map((pr, i) => {
      dataFormat.push({
        name: Object.keys(req.body)[i],
        value: req.body[pr],
      });
    });
    const dataValidated1 = dataValidator(dataFormat).filter(
      (clc) => clc.name !== undefined
    );
    if (dataValidated1.filter((dt) => dt.status === false).length) {
      errorObj = { type: "sintax", error: JSON.stringify(dataValidated1) };
      throw new Error(JSON.stringify(errorObj));
    }
    const dataValidated2 = await validateUniqueData({
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
    });
    if (dataValidated2.filter((df) => df.available === false).length) {
      errorObj = { type: "unavailable", error: JSON.stringify(dataValidated2) };
      throw new Error(JSON.stringify(errorObj));
    }
    req.body.password = await bcrypt.hash(req.body.password, 10);
    const myUser: any = await UserTable.create<UserModelInterface>(req.body);
    const token: string = generateJWT("emailVerifier", myUser._id!);
    await emailWorker.sendEmailVerifier(myUser, token);
    return res.status(201).json({
      ok: true,
      message:
        "Account created successfully but its not active please verify your account with the email just send to your mailbox",
      error: {
        sintaxData: [],
        unavailableData: [],
      },
    });
  } catch (error) {
    try {
      let errorObj: any;
      if (error instanceof Error) errorObj = JSON.parse(error.message);
      const message: string =
        errorObj.type === "incomplete"
          ? errorObj.error
          : errorObj.type === "sintax"
          ? "Error sintax data"
          : "Error unavailable data";
      const sintaxData =
        errorObj.type === "sintax" ? JSON.parse(errorObj.error) : [];
      const unavailableData =
        errorObj.type === "unavailable" ? JSON.parse(errorObj.error) : [];
      return res.status(400).json({
        ok: false,
        message,
        error: {
          sintaxData,
          unavailableData,
        },
      });
    } catch (error) {
      return res.status(500).send("Server error try again later :/");
    }
  }
};

export const activatorController = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    if (!req.params.token) throw new Error("Token no provided");
    const secretValue: string | null = decodeJWT(
      "emailVerifier",
      req.params.token
    );
    if (secretValue === null)
      throw new Error("Invalid token please generate one more");
    await UserTable.findOneAndUpdate({ _id: secretValue }, { is_active: true });
    return res.status(200).send("Account activated successfully");
  } catch (error) {
    return res
      .status(400)
      .send(
        `${
          error instanceof Error
            ? error.message
            : "Unexpected error try again later. "
        }`
      );
  }
};

export const emailValidatorBackController = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const emailWorker = new EmailActions();
    let errorObj: { type: "incomplete" | "sintax"; error: string };
    if (!req.params.email) {
      errorObj = {
        type: "incomplete",
        error: "Account email is required",
      };
      throw new Error(JSON.stringify(errorObj));
    }
    const dataValidated1 = dataValidator([
      {
        name: "email",
        value: req.params.email,
      },
    ]).filter((clc) => clc.name !== undefined);
    if (dataValidated1.filter((dt) => dt.status === false).length) {
      errorObj = { type: "sintax", error: JSON.stringify(dataValidated1) };
      throw new Error(JSON.stringify(errorObj));
    }
    const user: UserModelInterface | null =
      await UserTable.findOne<UserModelInterface>({
        email: req.params.email,
        is_active: false,
      });
    if (user === null) {
      errorObj = { type: "incomplete", error: "Such account is not available" };
      throw new Error(JSON.stringify(errorObj));
    }
    const interval: number = +periodEmailShipments / 60000;
    const dateNow = new Date();
    dateNow.setMinutes(dateNow.getMinutes() - interval);
    if (new Date(user.updatedAt!) < dateNow) {
      const token: string = generateJWT("emailVerifier", user._id!);
      await emailWorker.sendEmailVerifier(user, token);
      await UserTable.findOneAndUpdate({ _id: user._id! }, { name: user.name }); // to refresh timestamp
    } else {
      errorObj = {
        type: "incomplete",
        error: `Validator not send , please wait ${
          new Date(user.updatedAt!).getMinutes() + 1 - dateNow.getMinutes()
        } Minutes`,
      };
      throw new Error(JSON.stringify(errorObj));
    }
    return res.status(200).json({
      ok: true,
      message: "Email validator just send to your email address limit 3 min",
      error: {
        sintaxData: [],
      },
    });
  } catch (error) {
    try {
      let errorObj: any;
      if (error instanceof Error) errorObj = JSON.parse(error.message);
      const message: string =
        errorObj.type === "incomplete"
          ? errorObj.error
          : errorObj.type === "sintax"
          ? "Error sintax data"
          : "Error unavailable data";
      const sintaxData =
        errorObj.type === "sintax" ? JSON.parse(errorObj.error) : [];
      return res.status(400).json({
        ok: false,
        message,
        error: {
          sintaxData,
        },
      });
    } catch (error) {
      return res.status(500).send("Server error try again later :/");
    }
  }
};

export const forgetPasswordStep1 = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const emailWorker = new EmailActions();
    let errorObj: { type: "incomplete" | "sintax"; error: string };
    if (!req.body.email) {
      errorObj = {
        type: "incomplete",
        error: "Account email is required",
      };
      throw new Error(JSON.stringify(errorObj));
    }
    const dataValidated1 = dataValidator([
      {
        name: "email",
        value: req.body.email,
      },
    ]).filter((clc) => clc.name !== undefined);
    if (dataValidated1.filter((dt) => dt.status === false).length) {
      errorObj = { type: "sintax", error: JSON.stringify(dataValidated1) };
      throw new Error(JSON.stringify(errorObj));
    }
    const user: UserModelInterface | null =
      await UserTable.findOne<UserModelInterface>({ email: req.body.email });
    if (user === null) {
      errorObj = { type: "incomplete", error: "Such account is not available" };
      throw new Error(JSON.stringify(errorObj));
    }
    const interval: number = +periodEmailShipments / 60000;
    const dateNow = new Date();
    dateNow.setMinutes(dateNow.getMinutes() - interval);
    if (new Date(user.updatedAt!) < dateNow) {
      const token: string = generateJWT("resetPassword", user._id!);
      await emailWorker.sendResetPasswordCode(user, token);
      await UserTable.findOneAndUpdate({ _id: user._id! }, { name: user.name }); // to refresh timestamp
    } else {
      errorObj = {
        type: "incomplete",
        error: `ResetPassword not send , please wait ${
          new Date(user.updatedAt!).getMinutes() + 1 - dateNow.getMinutes()
        } Minutes`,
      };
      throw new Error(JSON.stringify(errorObj));
    }
    return res.status(200).json({
      ok: true,
      message: "Reset password just send to your email address lim 3 min",
      error: {
        sintaxData: [],
      },
    });
  } catch (error) {
    try {
      let errorObj: any;
      if (error instanceof Error) errorObj = JSON.parse(error.message);
      const message: string =
        errorObj.type === "incomplete"
          ? errorObj.error
          : errorObj.type === "sintax"
          ? "Error sintax data"
          : "Error unavailable data";
      const sintaxData =
        errorObj.type === "sintax" ? JSON.parse(errorObj.error) : [];
      return res.status(400).json({
        ok: false,
        message,
        error: {
          sintaxData,
        },
      });
    } catch (error) {
      return res.status(500).send("Server error try again later :/");
    }
  }
};

export const forgetPasswordStep2 = (req: Request, res: Response): void => {
  if (!req.params.token) res.send("Error server");
  else res.render("UpdatePassword", { token: req.params.token });
};

export const forgetPasswordStep3 = async (req: Request, res: Response) => {
  try {
    if (![req.body.tk, req.body.pass1, req.body.pass2])
      throw new Error("Incomplete data");
    if (typeof req.body.pass1 !== "string")
      throw new Error("Password must be string");
    if (req.body.pass1 !== req.body.pass2)
      throw new Error("Password does not match");
    if (req.body.pass1.length < 8)
      throw new Error("Invalid Password at least 8 characters long");
    const data = decodeJWT("resetPassword", req.body.tk);
    if (data === null)
      throw new Error("Invalid token please generate a new one");
    req.body.pass1 = await bcrypt.hash(req.body.pass1, 10);
    await UserTable.findOneAndUpdate(
      { _id: data },
      { password: req.body.pass1 }
    );
    res.send("Account password updated successfully");
  } catch (error) {
    res
      .status(400)
      .send(
        error instanceof Error ? error.message : "Server error try again later"
      );
  }
};
