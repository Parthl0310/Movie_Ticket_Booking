import dotenv from "dotenv"
dotenv.config()
import express from 'express';
import cors from 'cors';
import connectdb from './configs/db.js';
import { clerkMiddleware  } from '@clerk/express'
import{serve} from 'inngest/express'
import { functions, inngest } from './inngest/index.js';
import showRouter from './Routers.js/ShowRoutes.js';
import bookingRouter from './Routers.js/BookingRoutes.js';
import adminRouter from './Routers.js/AdminRoutes.js';
import userRouter from './Routers.js/UserRoutes.js';
import { stripeWebhooks } from './Controllers/stripewebhooks.js';



const app=express();
const port=3000;

// Stripe Webhooks Route
app.post('/api/stripe',express.raw({type:'application/json'}),stripeWebhooks)

app.use(express.json())
app.use(cors())
app.use(clerkMiddleware())

await connectdb()

app.get('/',(req,res)=>res.send('Server Is Live'))
app.use('/api/inngest',serve({client:inngest,functions}))
app.use('/api/show',showRouter)
app.use('/api/booking',bookingRouter)
app.use('/api/admin',adminRouter)
app.use('/api/user',userRouter)

app.listen(port,()=>{
    return console.log(`Server Listining at http://localhost:${port}`);
})