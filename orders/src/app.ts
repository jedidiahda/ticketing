import express  from "express";
import 'express-async-errors';
import { json } from "body-parser";
import cookieSession from 'cookie-session';

import { errorHandler } from "@ticketnpm/common";
import { NotFoundError, currentUser } from "@ticketnpm/common";
import { indexOrderOrder } from "./routes";
import { deleteOrderOrder } from "./routes/delete";
import { newOrderOrder } from "./routes/new";
import { showOrderOrder } from "./routes/show";

const app = express();
app.set('trust proxy', true);
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== 'test',
  })
);

app.use(currentUser);

app.use(indexOrderOrder);
app.use(deleteOrderOrder);
app.use(newOrderOrder);
app.use(showOrderOrder);

app.get('/api/tickets/lida',(req,res) => {
  res.send("hi lida!");
});

app.all('*', async () => {
  throw new NotFoundError();
});
//error middleware
app.use(errorHandler);

export { app };