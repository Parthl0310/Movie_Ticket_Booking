import dotenv from "dotenv";
dotenv.config();
import { Inngest } from "inngest";
import User from "../models/User.js";
import Booking from "../models/Booking.js";
import Show from "../models/Show.js";
import sendEmail from "../configs/nodeMailer.js";

export const inngest = new Inngest({
  id: "Movie_ticket_booking",
  eventKey: process.env.INNGEST_EVENT_KEY,
});

// inngest to add user
const syncUserCreation = inngest.createFunction(
  { id: "sync-user-from-clerk" },
  { event: "clerk/user.created" },
  async ({ event }) => {
    const { id, first_name, last_name, email_addresses, image_url } =
      event.data;
    const user = {
      _id: id,
      name: first_name + " " + last_name,
      email: email_addresses[0].email_address,
      image: image_url,
    };
    await User.create(user);
  },
);

//inngest to delete user
const DeleteUser = inngest.createFunction(
  { id: "delete-user" },
  { event: "clerk/user.deleted" },
  async ({ event }) => {
    const { id } = event.data;
    await User.findByIdAndDelete(id);
  },
);

// inngest to update user
const UpdateUser = inngest.createFunction(
  { id: "update-user" },
  { event: "clerk/user.updated" },
  async ({ event }) => {
    const { id, first_name, last_name, email_addresses, image_url } =
      event.data;
    const updateduser = {
      name: first_name + " " + last_name,
      email: email_addresses[0].email_address,
      image_url: image_url,
    };
    await User.findByIdAndUpdate(id, updateduser);
  },
);

// Ingest Function to cancel booking and release seats of show after 10 minutes of booking created if payment is not made
const releaseSeatsAndDeleteBooking = inngest.createFunction(
  { id: "release-seats-delete-booking" },
  { event: "app/checkpayment" },
  async ({ event, step }) => {
    const tenMinutesLater = new Date(Date.now() + 10 * 60 * 1000);
    await step.sleepUntil("wait-for-10-minutes", tenMinutesLater);
    await step.run("check-payment-status", async () => {
      const bookingId = event.data.bookingId;
      const booking = await Booking.findById(bookingId);

      // if payment is not made ,release seats and delete booking
      if (!booking.isPaid) {
        const show = await Show.findById(booking.show);
        booking.bookedSeats.forEach((seat) => {
          delete show.occupiedseats[seat];
        });
        show.markModified("occupiedseats");
        await show.save();
        await Booking.findByIdAndDelete(booking._id);
      }
    });
  },
);

// conformation mail of ticket
const sendBookingConfirmationEmail = inngest.createFunction(
  { id: "send-booking-conformation-email" },
  { event: "app/show.booked" },
  async ({ event, step }) => {
    const { bookingId } = event.data;
    const booking = await Booking.findById(bookingId)
      .populate({
        path: "show",
        populate: {
          path: "movie",
          model: "Movie",
        },
      })
      .populate("user");

    await sendEmail({
      to: booking.user.email,
      subject: `Payment Conformation: ${booking.show.movie.title} booked`,
      body: ` <div style="font-family:Arial,sans-serif;line-height:1.5;">
          <h2>Hi ${booking.user.name},</h2>
          <p>
            Your Booking for <strong style="color:#F84565;">"${
              booking.show.movie.title
            }</strong> is confirmed.
          </p>
          <p>
            <strong>Date:</strong>${new Date(booking.show.showdatetime).toLocaleDateString("en-us", { timeZone: "Asia/Kolkata" })}<br/>
            <strong>Date:</strong>${new Date(booking.show.showdatetime).toLocaleTimeString("en-us", { timeZone: "Asia/Kolkata" })}<br/>
          </p>
          <p>
            Enjoy the Show 🍿
          </p>
          <p>Thank For Booking With Us!<br/>- QuickShow team</p>
        </div> `,
    });
  },
);

//reminder mail to the user
const reminderEmail = inngest.createFunction(
  { id: "show-reminders-email" },
  { cron: "0 */8 * * *" },
  async ({ step }) => {
    const now = new Date();
    const in8hour = new Date(now.getTime() + 8 * 60 * 60 * 1000);
    const windowStart = new Date(in8hour.getTime());
    //Prepare reminder tasks
    const reminderTasks = await step.run("Prepare-reminder-tasks", async () => {
      const shows = await Show.find({
        showdatetime: { $gte: windowStart, $lte: in8hour },
      }).populate("movie");

      const tasks = [];
      for (const show of shows) {
        if (!show.movie || !show.occupiedseats) continue;

        const userIds = [...new set(Object.values(show.occupiedseats))];
        if (userIds.length === 0) continue;

        const users = await User.find({
          _id: {
            $in: userIds,
          },
        }).select("name Email");

        for (const user of users) {
          tasks.push({
            userEmail: user.email,
            userName: user.name,
            movieTitle: show.movie.title,
            showTime: show.showTime,
          });
        }
      }
      return tasks;
    });

    if (reminderTasks.length === 0) {
      return { sent: 0, message: "No reminders To send." };
    }
    const results = await step.run("send-all-reminfers", async () => {
      return await Promise.allSettled(
        reminderTasks.map((task) =>
          sendEmail({
            to: task.userEmail,
            subject: `Reminder: Your Movie ${task.movieTitle} starts soon!`,
            body: ` <div style="font-family:Arial,sans-serif;line-height:1.5;">
          <h2>Hllo ${task.userName},</h2>
          <p> This is a quick reminder that your movie:
          </p>
          <p>
          is scheduled For
            <strong>Date:</strong>${new Date(task.showTime).toLocaleDateString("en-us", { timeZone: "Asia/Kolkata" })} at
            <strong>Date:</strong>${new Date(task.showTime).toLocaleTimeString("en-us", { timeZone: "Asia/Kolkata" })}<br/>
          </p>
          <p>
            It Starts in Approximately <strong> 30 min</strong> -make sure you're ready!
          </p>
          <p>Enjoy the Show!<br/> QuickShow team</p>
        </div> `,
          }),
        ),
      );
    });
    const sent=results.filter(r => r.status === 'fulfilled').length;
    const failed=results.length -sent;
    return{
        sent,
        failed,
        message:`Sent ${sent} reminder(s), ${failed} failed.`
    }
  },
);

export const functions = [
  syncUserCreation,
  DeleteUser,
  UpdateUser,
  releaseSeatsAndDeleteBooking,
  sendBookingConfirmationEmail,
  reminderEmail
];
