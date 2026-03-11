import { Inngest } from "inngest";
import User from "../models/User.js";

export const inngest = new Inngest({ id: "Movie_ticket_booking" });

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
           image_url:image_url 
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
        updateduser={
            name:first_name+' '+last_name,
            email:email_addresses[0].email_address,
            image_url:image_url
        }
        await User.findByIdAndUpdate(id,updateduser);
    }

)

export const functions = [syncUserCreation,DeleteUser,UpdateUser];