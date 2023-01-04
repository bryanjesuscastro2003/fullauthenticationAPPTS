import mongoose from "mongoose";
import * as config from  "../config/index"

const connection = async () : Promise<void> => {
        try {
              await mongoose.connect(config.mongoUrl)    
              console.log("Connected to mongo db successfully")            
        } catch (error) {
              console.log("Unexpected db connection")
              throw error
        }
}

export default connection