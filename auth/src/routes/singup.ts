import express, { Request, Response }  from 'express';
import {body, validationResult} from 'express-validator';
// import { RequestValidationError } from '../errors/request-validation-error';
import jwt from 'jsonwebtoken';

import { validateRequest } from '@ticketnpm/common';
import { User } from '../models/user';
import { BadRequestError } from '@ticketnpm/common';

const router = express.Router();

//add middleware - body is middleware
//if email is empty, send back a message
router.post('/api/users/signup',[
  body('email')
  .isEmail()
  .withMessage('Email must be valid'),
  body('password')
  .trim()
  .isLength({min: 4, max:20})
  .withMessage('Password must be between 4 and 20 charactors')
], 
validateRequest,
//must specify type of req & res, typescript validation
async (req: Request, res: Response) => {
  // const errors = validationResult(req);

  // if(!errors.isEmpty()){
  //   // throw new Error('Invalid email or password');
  //   // return res.status(400).send(errors.array());
  //   throw new RequestValidationError(errors.array());
  // }

  const { email, password } = req.body;

  const existingUser = await User.findOne({email});
  
  if(existingUser){
    // console.log('Email in user');
    // return res.send({});
    throw new BadRequestError('Email is used');
  }

  const user = User.build({ email, password});
  await user.save()
            .catch(() => console.log('not save'));
  
  const userJwt = jwt.sign({
    id: user.id,
    email: user.email
  }, 
  process.env.JWT_KEY! //tell typescript that env var is defined, skip error
  );

  //typescript doesn't want us to assume
  //that there is object session in request
  req.session ={
    jwt: userJwt
  };

  res.status(201).send({user});

});

export { router as signupRouter };