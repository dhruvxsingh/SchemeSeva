import dotenv from "dotenv";
dotenv.config(); // ✅ Must be FIRST before anything else

import connectDB from "./db/index.js";
import { app } from "./app.js";

connectDB()
  .then(() => {          // ✅ Fixed: arrow function wrapper needed here
    app.listen(process.env.PORT || 5000, () => {
      console.log(`Server running on port ${process.env.PORT || 5000}`);
    });
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB", error);
    process.exit(1);
  });