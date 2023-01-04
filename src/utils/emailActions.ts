import { emailCondig, baseUrl } from "../config";
import nodemailer from "nodemailer";
import { EmailConfig } from "../types";
import hbs from "nodemailer-express-handlebars";
import path from "path";
import { UserModelInterface, EmailInfo } from "../interfaces";

class EmailActions {
  private _emailConfig: EmailConfig;
  private _transporter: any;
  private _handleOptions: any;
  private _baseUrl: string | null;

  constructor() {
    this._emailConfig = emailCondig;
    this._baseUrl = baseUrl;

    this._transporter = nodemailer.createTransport({
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
        extname: ".handlebars", // handlebars extension
        layoutsDir: path.resolve("./public/views"), // location of handlebars templates
        defaultLayout: false, // name of main template
      },
      viewPath: path.resolve("./public/views"),
      extName: ".handlebars",
    };
    this._transporter.use("compile", hbs(this._handleOptions));
  }

  private setMailer = (
    addressee: UserModelInterface,
    subject: string,
    template: string,
    title: string,
    code: string | number | undefined,
    link: string | undefined
  ): EmailInfo => {
    return {
      from: `"Join Tec 👻" <${this._emailConfig.USER}>`, // sender address
      to: `${addressee.email}`, // list of receivers
      subject: subject, //"Hi, this is the email verifier ✔", // Subject line
      template: template, //"Emailverifier",
      context: {
        title: title,
        username: addressee.username,
        email: addressee.email,
        code: code,
        link: link,
        possible_mistake:
          "If your are not the user,  just ignore this email thanks",
      },
    };
  };

  sendEmailVerifier = async (
    data: UserModelInterface,
    token: string
  ): Promise<boolean> => {
    try {
      let info: EmailInfo = this.setMailer(
        data,
        "Hi, this is the email verifier ✔",
        "Emailverifier",
        "Please confirm your Account pressing the link down below limit 3 min",
        undefined,
        `http://${this._baseUrl}/auth/activator/${token}`
      );
      await this._transporter.sendMail(info);
      return true;
    } catch (error) {
      throw error;
    }
  };

  sendResetPasswordCode = async (
    data: UserModelInterface,
    token: string
  ): Promise<boolean> => {
    try {
      let info: EmailInfo = this.setMailer(
        data,
        "Hi, this is the reset password code ✔",
        "Emailverifier",
        "Push on the link down bellow to update your password limit 3 min ",
        undefined,
        `http://${this._baseUrl}/auth/forget/password/st2/${token}`
      );
      await this._transporter.sendMail(info);
      return true;
    } catch (error) {
      throw error;
    }
  };
}

export default EmailActions;
