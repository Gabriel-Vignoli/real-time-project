import mongoose from "mongoose";

mongoose.set('strictQuery', true)
mongoose.set('strictPopulate', false)

export async function connect() {
    try {
        const connection = await mongoose.connect('mongodb://localhost:27017/websocketteste')
        console.log('Connected to MongoDB')
    } catch (err) {
        if (err instanceof Error) {
            console.error('Failed to connect to MongoDB:', err.message);
        } else {
            console.error('An unknown error occurred:', err);
        }   
    }
}