    import { Inngest } from "inngest";
    import User from "../models/User.js";
    import Booking from "../models/Booking.js";
    import Show from "../models/Show.js";

    export const inngest = new Inngest({ id: "Movie_ticket_booking",
        eventKey: process.env.INNGEST_EVENT_KEY,
    });

    // inngest to add user
    const syncUserCreation=inngest.createFunction(
        {id:'sync-user-from-clerk'},
        {event:'clerk/user.created'},
        async ({event})=>{
            const {id,first_name,last_name,email_addresses,image_url}=event.data;
            const user={
            _id:id,
            name: first_name + ' ' + last_name,
            email:email_addresses[0].email_address,
            image:image_url 
            }
            await User.create(user);
        }
    )

    //inngest to delete user
    const DeleteUser=inngest.createFunction(
        {id:'delete-user'},
        {event:'clerk/user.deleted'},
        async ({event})=>{
            const {id}=event.data;
            await User.findByIdAndDelete(id);
        }
    )

    // inngest to update user
    const UpdateUser=inngest.createFunction(
        {id:'update-user'},
        {event:'clerk/user.updated'},
        async ({event})=>{
            const {id,first_name,last_name,email_addresses,image_url}=event.data;
            const updateduser={
                name:first_name+' '+last_name,
                email:email_addresses[0].email_address,
                image_url:image_url
            }
            await User.findByIdAndUpdate(id,updateduser);
        }

    )

    // Ingest Function to cancel booking and release seats of show after 10 minutes of booking created if payment is not made
    const releaseSeatsAndDeleteBooking=inngest.createFunction(
        {id:'release-seats-delete-booking'},
        {event:'app/checkpayment'},
        async ({event,step})=>{
            const tenMinutesLater=new Date(Date.now()+(10*60*1000));
            await step.sleepUntil('wait-for-10-minutes',tenMinutesLater);
            await step.run('check-payment-status',async ()=>{
                const bookingId=event.data.bookingId;
                const booking=await Booking.findById(bookingId)

                // if payment is not made ,release seats and delete booking
                if(!booking.isPaid){
                    const show=await Show.findById(booking.show);
                    booking.bookedSeats.forEach((seat)=>{
                        delete show.occupiedseats[seat]
                    });
                    show.markModified('occupiedseats')
                    await show.save()
                    await Booking.findByIdAndDelete(booking._id)
                }
            })


        }
    )

    export const functions = [syncUserCreation,DeleteUser,UpdateUser,releaseSeatsAndDeleteBooking];