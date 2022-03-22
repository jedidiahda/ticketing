import mongoose from 'mongoose';
import { Password } from '../../src/services/password';

//user attributes
//typescript is not checking the type of arguments
//we are passing to that constructor.
//to solve this, we create an interface that programer
//must follow like properties below
interface UserAttrs {
  email: string, //typescript use lower case string
  password: string
}
//a usermodel that return UserDoc instead of any
// interface UserModel extends mongoose.Model<any>{
//   build(attrs: UserAttrs): any;
// }
interface UserModel extends mongoose.Model<UserDoc>{
  build(attrs: UserAttrs): UserDoc;
}
//interface that describe what user interface looks like
interface UserDoc extends mongoose.Document{
  email: string;
  password: string;
}

const userSchema = new mongoose.Schema({
  email:{
    type: String, //build-in String contructor, mongoose use capital S
    required: true, 
  },
  password:{
    type: String,
    required: true 
  }
},{
  toJSON:{
    transform(doc, ret){
      ret.id = ret._id;
      delete ret._id;
      delete ret.password; //js delete object
      delete ret.__v;
    }
  }
});

//we used function cos because we want
//to use this (class)
userSchema.pre('save', async function(done){
  if(this.isModified('password')){
    const hashed = await Password.toHash(this.get('password'));
    this.set('password', hashed);
  }
  done();
});

userSchema.statics.build = (attrs: UserAttrs) => {
  return new User(attrs);
};

//generic type in typescript
//provide UserDoc(type) and UserMode(type) to mongoose.model function
//export function mode<T extends Document, U exteds Model<T>>(...): U(return type);
const User = mongoose.model<UserDoc, UserModel>('User', userSchema);
//so whenever creating a new user
//we must pass the correct attribute like UserAttrs
//typescript will check this for us
// const buildUser = (attrs: UserAttrs) => {
//   return new User(attrs);
// }


export { User };