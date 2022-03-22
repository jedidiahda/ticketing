import express  from "express";
import 'express-async-errors';
import { json } from "body-parser";
import cookieSession from 'cookie-session';

import { currentUserRouter } from "./routes/current-user";
import { signinRouter } from "./routes/singin";
import { signoutRouter } from "./routes/singout";
import { signupRouter } from "./routes/singup";
import { errorHandler } from "@ticketnpm/common";
import { NotFoundError } from "@ticketnpm/common";

const app = express();
app.set('trust proxy', true);
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== 'test',
  })
)

app.use(currentUserRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(signupRouter);

app.all('*', async () => {
  throw new NotFoundError();
});

//error middleware
app.use(errorHandler);

export { app };