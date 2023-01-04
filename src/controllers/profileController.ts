import { Response, Request } from "express";
import { inputData } from "../types";
import { UserModelInterface } from "../interfaces";
import { dataValidator, validateUniqueData } from "../utils/dataValidator";
import UserTable from "../db/models/user.model";
import EmailActions from "../utils/emailActions";
import { generateJWT } from "../utils/jwtActions";
import bcrypt from "bcrypt";

export const getProfileController = async (
  req: Request,
  res: Response
): Promise<Response> => {
  return res.status(200).json({
    ok: true,
    message: "Logged in successfully",
    user: req.user,
  });
};

// name - lastname
export const updateDataLevel1 = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    let errorObj: {
      type: "incomplete" | "sintax";
      error: string;
    };
    const params = ["name", "lastname"];
    if (![req.body.name, req.body.lastname].every(Boolean)) {
      errorObj = {
        type: "incomplete",
        error: `${params} are required`,
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
    await UserTable.findOneAndUpdate(
      { _id: req.user._id! },
      { name: req.body.name, lastname: req.body.lastname }
    );
    return res.status(200).json({
      ok: true,
      message: "Data updated successfully",
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

// email - phonenumber - username
export const updateDataLevel2 = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    let errorObj: {
      type: "incomplete" | "sintax" | "unavailable";
      error: string;
    };
    const emailWorker = new EmailActions();
    const params = ["email", "phoneNumber", "username"];
    if (
      ![req.body.email, req.body.phoneNumber, req.body.username].every(Boolean)
    ) {
      errorObj = {
        type: "incomplete",
        error: `${params} are required`,
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
    let validations: Array<{
      name: "email" | "phoneNumber" | "username";
      value: string;
    }> = [];
    let tempCounter: number = 0,
      emailModified: boolean = false;
    if (req.user.email! !== req.body.email) {
      validations.push({
        name: "email",
        value: req.body.email,
      });
      tempCounter++;
      emailModified = true;
    }
    if (req.user.phoneNumber! !== req.body.phoneNumber) {
      validations.push({
        name: "phoneNumber",
        value: req.body.phoneNumber,
      });
      tempCounter++;
    }
    if (req.user.username! !== req.body.username) {
      validations.push({
        name: "username",
        value: req.body.username,
      });
      tempCounter++;
    }
    if (tempCounter !== 0) {
      const dataValidated2 = await validateUniqueData({
        values: validations,
      });
      if (dataValidated2.filter((df) => df.available === false).length) {
        errorObj = {
          type: "unavailable",
          error: JSON.stringify(dataValidated2),
        };
        throw new Error(JSON.stringify(errorObj));
      }
      const token: string = generateJWT("emailVerifier", req.user._id!);
      const userUpdated: UserModelInterface | null =
        await UserTable.findOneAndUpdate<UserModelInterface>(
          { _id: req.user._id! },
          {
            username: req.body.username,
            phoneNumber: req.body.phoneNumber,
            email: req.body.email,
            is_active: emailModified ? false : true,
          },
          { new: true }
        );
      if (userUpdated === null) {
        errorObj = {
          type: "incomplete",
          error: "User not found please restart your session",
        };
        throw new Error(JSON.stringify(errorObj));
      }
      if (emailModified)
        await emailWorker.sendEmailVerifier(userUpdated, token);
    }
    return res.status(200).json({
      ok: true,
      message: emailModified
        ? "Data updated please verify your account with the email just send to your mailbox"
        : "Data updated successfully",
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

// password
export const updateDataLevel3 = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    if (![req.body.newpassword].every(Boolean))
      throw new Error("Password is required");
    if (typeof req.body.newpassword !== "string")
      throw new Error("Password must be string");
    if (req.body.newpassword.length < 8)
      throw new Error("Invalid Password at least 8 characters long");
    req.body.newpassword = await bcrypt.hash(req.body.newpassword, 10);
    await UserTable.findOneAndUpdate(
      { _id: req.user._id },
      { password: req.body.newpassword }
    );
    return res.status(200).json({
      ok: true,
      message: "Data updated successfully",
      error: {
        sintaxData: [],
      },
    });
  } catch (error) {
    return res.status(400).json({
      ok: true,
      message: "Error sintax data",
      error: {
        sintaxData: [
          {
            name: "password",
            status: false,
            error: `Password : ${
              error instanceof Error
                ? error.message
                : "Server error try again later"
            }`,
          },
        ],
      },
    });
  }
};
