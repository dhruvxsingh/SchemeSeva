import dotenv from "dotenv";
dotenv.config();
import csvtojson from "csvtojson";
import mongoose from "mongoose";
import { DB_NAME } from "./constants.js";

const connectAndImport = async () => {
    const cleanURL = process.env.MONGODB_URL.replace(/\/$/, '');
    await mongoose.connect(`${cleanURL}/${DB_NAME}`);
    console.log("MongoDB Connected...");

    const db = mongoose.connection.db;
    const collection = db.collection("kaggleschemes");

    const schemes = await csvtojson().fromFile("./updated_data.csv");
    console.log(`Importing ${schemes.length} schemes...`);
    
    await collection.deleteMany({});
    await collection.insertMany(schemes);
    console.log("✅ Import complete!");
    process.exit(0);
};

connectAndImport().catch(console.error);