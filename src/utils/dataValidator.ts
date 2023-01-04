import Joi from "@hapi/joi";
import { inputData, inputData2, outputData, outputData2, unavailabledataType } from "../types";
import UserTable from "../db/models/user.model";

export const dataValidator = (data: inputData): outputData => {
  let outDataRes: outputData = [];
  data.map((param) => {
    try {
      switch (param.name) {
        case "name":
        case "lastname":
        case "username":
          Joi.assert(param.value, Joi.string().min(5).max(20).required());
          break;
        case "email":
          Joi.assert(
            param.value,
            Joi.string()
              .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
              .required()
          );
          break;
        case "phoneNumber":
          Joi.assert(param.value, Joi.string().min(7).max(12).required());
          break;
        case "password":
          Joi.assert(param.value, Joi.string().min(8).max(50).required());
          break;
        default:
          break;
      }
      outDataRes.push({
        name: param.name,
        status: true,
        error: null,
      });
    } catch (error) {
      outDataRes.push({
        name: param.name,
        status: false,
        error: error instanceof Error ? error.message : `Invalid ${param.name}`,
      });
    }
  });
  return outDataRes;
};

export const validateUniqueData = async (data: inputData2): Promise<outputData2> => {
  try {
    const searchData = async (
      param: "phoneNumber" | "email" | "username",
      value: string,
      ref?: string
    ): Promise<unavailabledataType> => {
      try {
        let setter: object = {};
        switch (param) {
          case "phoneNumber":
            setter = { phoneNumber: value };
            break;
          case "email":
            setter = { email: value };
            break;
          default:
            setter = { username: value };
        }
        setter = ref === undefined ? {...setter} : {...setter, _id: { $ne: ref }}
        return  await UserTable.findOne(setter).then((val) => {
          if (val === null)
            return {
              param,
              available: true,
            };
          return {
            param,
            available: false,
          };
        });
      } catch (error) {
          throw error
      }
    };
    const workers : Array<(resolve : any) => unavailabledataType> = []
    data.values.map(dt => {
        workers.push(resolve  => resolve(searchData(dt.name, dt.value)))        
    })
    const resolverValues = await Promise.all(workers.map(rm => new Promise<unavailabledataType>(rm)))
   return resolverValues
  } catch (error) {
      throw error
  }
};
