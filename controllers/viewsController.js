const Tour = require('../models/tourModel');
const User = require('../models/userModel');
const catchAsync = require('../utlis/catchAysnc');
const AppError = require('../utlis/appError');

exports.getOverview = catchAsync(async (req, res, next) => {
  // 1 Get tour data ffrom collection
  const tours = await Tour.find();
  // 2 build template
  // 3 render taht template using tour data form 1) 
  res.status(200).render('overview', {
    title: 'All Tours',
    tours
  });
})
exports.getTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findOne({ slug: req.params.slug }).populate({
    path: 'reviews',
    fields: 'review rating user'
  });
  if (!tour) {
    return next(new AppError('there is no tour with that name.', 404));
  }
  res.status(200).set(
    'Content-Security-Policy',
    "default-src 'self' https://*.mapbox.com ;base-uri 'self';block-all-mixed-content;font-src 'self' https: data:;frame-ancestors 'self';img-src 'self' data:;object-src 'none';script-src https://cdnjs.cloudflare.com https://api.mapbox.com 'self' blob: ;script-src-attr 'none';style-src 'self' https: 'unsafe-inline';upgrade-insecure-requests;"
  ).render('tour', {
    title: `${tour.name} Tour`,
    tour
  })
})
exports.getLoginForm = (req, res) => {
  res.status(200).render('login', {
    title: 'Log into your account'
  })
}
exports.account = (req, res) => {
  res.status(200).render('account', {
    title: "Your Account"
  });
};
// this work with form tag in html
exports.updateUserData = catchAsync(async (req, res, next) => {
  const updatedUser = await User.findByIdAndUpdate(req.user.id, {
    name: req.body.name,
    email: req.body.email
  }, {
    new: true,
    runValidators: true
  });
  res.status(200).render('account', {
    title: "Your Account",
    user: updatedUser
  });
})