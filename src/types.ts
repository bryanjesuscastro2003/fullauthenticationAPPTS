export type inputData = Array<{
    name : string,//"name" | "lastname" | "email" | "phoneNumber" | "username" | "password" | "role",
    value : string
  }>

 export  type outputData = Array<{
    name : string,
    status : boolean,
    error : string | null
}>

export type inputData2 = {
  ref?: string;
  values: Array<{
    name: "phoneNumber" | "email" | "username";
    value: string;
  }>;
};
export type unavailabledataType = {
    param: string; available: boolean
}
export type outputData2 = Array<unavailabledataType>

export type EmailConfig= {
  PORT : number | undefined,
  HOST : string | undefined
  USER : string | undefined,
  PASS : string | undefined
}