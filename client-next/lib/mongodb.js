import mongoose from "mongoose";

let cachedConnection = null;

const connectDB = async () => {
    if (cachedConnection) {
        return cachedConnection;
    }
    try {
        const db = await mongoose.connect(process.env.MONGODB_URI);
        cachedConnection = db;
        console.log("Connected to MongoDB.")
        return db;
    } catch (error) {
        console.log(error);
    }
};

export default connectDB;