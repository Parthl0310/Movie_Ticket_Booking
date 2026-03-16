import mongoose, { Types } from "mongoose";

const showschema=new mongoose.Schema({
    movie:{
        type:String,
        required:true,
        ref:'Movie'
    },
    showdatetime:{
        type:Date,
        required:true
    },
    showprice:{
        type:Number,
        required:true
    },
    occupiedseats:{
        type:Object,
        default:{}
    }
},{minimize:false})

const Show= mongoose.model("Show",showschema);

export default Show;