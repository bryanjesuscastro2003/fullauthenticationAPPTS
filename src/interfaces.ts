export enum RolesEnum {
  USER = "USER",
  MODERATOR = "MODERATOR",
  ADMIN = "ADMIN",
}

export interface UserModelInterface {
  _id?: string;
  name: string;
  lastname: string;
  phoneNumber: string;
  email: string;
  username: string;
  password: string;
  role: RolesEnum;
  is_active?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

type Context = {
  title: string;
  username: string;
  email: string;
  code: string | number | undefined;
  link: string | undefined;
  possible_mistake : string;
};

export interface EmailInfo {
  from: string;
  to: string;
  subject: string;
  template: string;
  context: Context
}