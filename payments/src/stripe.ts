import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_KEY!,{
  apiVersion:'2020-08-27', //auto loading by typescript

});