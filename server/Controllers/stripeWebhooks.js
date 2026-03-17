import stripe from "stripe";
import Booking from "../models/Booking.js";

export const stripeWebhooks = async (request, response) => {
  const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY);
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

        const sessionList = await stripeInstance.checkout.sessions.list({
          payment_intent: paymentIntent.id,
        });

        if (!sessionList.data.length) {
          console.log("❌ No session found for this payment intent");
          break;
        }

        const session = sessionList.data[0];

        if (!session.metadata || !session.metadata.bookingId) {
          console.log("❌ bookingId missing in metadata");
          break;
        }

        const bookingId = session.metadata.bookingId;

        console.log("✅ Booking ID:", bookingId);

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
