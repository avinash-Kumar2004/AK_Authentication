import e from "express";
import mongoose from "mongoose";
export const connectDB = async ()=>{
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI)
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
     console.log('Error in connection of MongoDB: ', error.message);
        process.exit(1)  //failure,exit with failure agar status 0 aata hai to success or agar 1 ata hai do fail 
    }
}