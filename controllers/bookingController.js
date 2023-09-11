const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const Tour = require('../models/tourModel');
const AppError = require('../utlis/appError');
const catchAysnc = require('../utlis/catchAysnc');
const factory = require('./handlerFactory');


// exports.getCheckoutSession = catchAysnc(async (req, res, next) => {
//   // 1) get the  currently booked tour
//   const tour = await Tour.findById(req.params.tourId);
//   // 2) Create checkout session
//   console.log(stripe.checkout.create, 'finish----------');
//   const session = await stripe.checkout.sessions.create({
//     payment_method_types: ['card'],
//     success_url: `${req.protocol}://${req.get('host')}/`,
//     cancel_url: `${req.protocol}://${req.get('host')}/tour/${tour.slug}`,
//     customer_email: req.user.email,
//     client_reference_id: req.params.tourId,

//     line_items: [
//       {
//         name: `${tour.name} Tour`,
//         description: tour.summary,
//         images: [`https://www.natours.dev/img/tours/${tour.imageCover}`],
//         amount: tour.price * 100,
//         currency: 'usd',
//         quantity: 1
//       }
//     ]
//   })
//   // 3) create session as response
//   res.status(200).json({
//     status: 'success',
//     session
//   })

// })


exports.getCheckoutSession = catchAysnc(async (req, res, next) => {
  // 1) get the currently booked tour
  const tour = await Tour.findById(req.params.tourId);
  // 2) Create checkout session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    mode: 'payment',
    success_url: `${req.protocol}://${req.get('host')}/`,
    cancel_url: `${req.protocol}://${req.get('host')}/tour/${tour.slug}`,
    customer_email: req.user.email,
    client_reference_id: req.params.tourId,

    line_items: [
      {
        price_data: {
          currency: 'usd',
          unit_amount: tour.price,
          product_data: {
            name: `${tour.name} Tour`,
            description: tour.summary,
            images: [`https://www.natours.dev/img/tours/${tour.imageCover}`],
          },
        },
        quantity: 1,
      }
    ]
  })
  // 3) create session as response 
  res.status(200).json({
    status: 'success',
    session
  })

})