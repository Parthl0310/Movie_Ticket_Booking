import stripe from "stripe";
import Booking from "../models/Booking.js";

export const stripeWebhooks = async (request, response) => {
  const stripeInstance = new stripe(`${process.env.STRIPE_SECRET_KEY}`);
  const sig = request.headers["stripe-signature"];

  let event;
  try {
    event = stripeInstance.webhooks.constructEvent(
      request.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET,
    );
  } catch (error) {
    return response.status(400).send(`webhooks Error: ${error.message}`);
  }
  console.log("fhdh");
  try {
    switch (event.type) {
      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object;

        const bookingId = paymentIntent.metadata.bookingId;

        console.log("Booking ID:", bookingId);

        if (!bookingId) {
          throw new Error("Booking ID not found in metadata");
        }

        await Booking.findByIdAndUpdate(bookingId, {
          isPaid: true,
          paymentLink: "",
        });

        break;
      }
      default:
        console.log("Unhelded event type:", event.type);
    }
    response.json({ received: true });
  } catch (err) {
    console.error("Webhook Processing error", err);
    response.status(500).send("Internal Server Error");
  }
};
