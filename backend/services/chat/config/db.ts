import mongoose from "mongoose";

export const connectToDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL!);
        console.log("Connected Chat service to MongoDB");
    } catch (err) {
        console.error(`Error in connecting to MongoDB ${JSON.stringify(err)}`);
    }
};
