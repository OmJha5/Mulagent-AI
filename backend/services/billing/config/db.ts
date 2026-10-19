import mongoose from "mongoose";

export const connectToDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL!);
        console.log("Connected Billing service to MongoDB");
    } catch (err) {
        console.log(`Error in connecting to MongoDB ${JSON.stringify(err)}`);
    }
};
