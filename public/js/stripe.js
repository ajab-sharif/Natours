/* eslint-disable */
import axios from "axios";
const stripe = Stripe('pk_test_51NYFfOHz5vlIcPfa4PtvWpr6LeUoziqWT8cxSvGNd0ShnYy4wHqrhVoXCcZo1uYgdmHeHrPIaz0aynONONd82fnV00WhM1KqBu')

export const bookTour = async tourid => {
  // 1) get checkout session from API
  const session = await axios(`/api/v1/booking//checkout-session/${tourid}`)
  // 2) create checkout form + chanre credit card
  console.log('click')
  await stripe.redirectToCheckout({
    sessionId: session.data.session.id
  })
}  