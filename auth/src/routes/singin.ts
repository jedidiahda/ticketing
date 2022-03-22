import express, { Request, Response }  from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';
import { User } from '../models/user';
import { Password } from '../services/password';
import { validateRequest } from '@ticketnpm/common';
import { BadRequestError } from '@ticketnpm/common';

const router = express.Router();

router.post('/api/users/signin',[
  body('email')
  .isEmail()
  .withMessage('Email must be valid'),
  body('password')
  .trim()
  .notEmpty()
  .withMessage('You must supply a password')
], 
validateRequest,
//must specify type of req & res, typescript validation
async (req: Request, res: Response) => {
  const { email, password} = req.body;
  
  const existingUser = await User.findOne({ email });
  // console.log(existingUser);
  if(!existingUser){
    throw new BadRequestError('Invalid credentials');
  }
  
  const passwordMatch = await Password.compare(existingUser.password, password);

  if(!passwordMatch) {
    throw new BadRequestError('Invalid Credentials');
  }
  const userJwt = jwt.sign({
    id: existingUser.id,
    email: existingUser.email
  }, 
  process.env.JWT_KEY! //tell typescript that env var is defined, skip error
  );
  //typescript doesn't want us to assume
  //that there is object session in request
  req.session ={
    jwt: userJwt
  };


  res.status(201).send({existingUser});
  

});


export { router as signinRouter };