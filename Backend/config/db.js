import mongoose from "mongoose";

export const connectDB = async() => {
    await mongoose.connect("mongodb+srv://hawladeprasenjit23_db_user:u7tqam5F8IQsp94Q@cluster0.8sdstff.mongodb.net/MediCare").then(() =>{
        console.log("DB connected")
    })
}