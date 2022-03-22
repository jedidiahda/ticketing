import mongoose from "mongoose";
import { app } from "./app";

//to connect to mongoose db, we can use auth-mongo-srv
const startUp =async () => {
  if(!process.env.JWT_KEY){
    throw Error('JWT_KEY doesn\'t existed');
  }

  if(!process.env.MONGO_URI){
    throw new Error('MONGO_URI must be defined');
  }

  try{
    //mongodb is auto created if auth is not created yet
    await mongoose.connect(process.env.MONGO_URI);
    console.log("mongodb is connected")
  }catch( err ){
    console.error(err);
  }

  app.listen(3000, () => {
  
    console.log("app listening to port 3000");
  });

};



startUp();
