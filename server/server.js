import express from 'express';
import cors from 'cors';
import connectdb from './configs/db.js';
import dotenv from "dotenv"
import { clerkMiddleware  } from '@clerk/express'
import{serve} from 'inngest/express'
import { functions, inngest } from './inngest/index.js';

dotenv.config()


const app=express();
const port=3000;


app.use(express.json())
app.use(cors())
app.use(clerkMiddleware())

await connectdb()

app.get('/',(req,res)=>res.send('Server Is Live'))
app.use('/api/inngest',serve({client:inngest,functions}))

app.listen(port,()=>{
    return console.log(`Server Listining at http://localhost:${port}`);
})