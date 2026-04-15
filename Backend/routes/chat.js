import express from "express";
import mongoose from "mongoose";

const router = express.Router();

router.post("/", async (req, res) => {
    const { message } = req.body;
    
    try {
        const db = mongoose.connection.useDb("scheme-seva");
        const collection = db.collection("kaggleschemes");
        
        const words = message.toLowerCase().split(" ")
            .filter(w => w.length > 3)
            .slice(0, 5);
        
        const schemes = await collection.find({
            $or: [
                { scheme_name: { $regex: words.join("|"), $options: "i" } },
                { details: { $regex: words.join("|"), $options: "i" } },
                { schemeCategory: { $regex: words.join("|"), $options: "i" } },
                { eligibility: { $regex: words.join("|"), $options: "i" } },
                { tags: { $regex: words.join("|"), $options: "i" } },
            ]
        }).limit(6).toArray();

        const reply = schemes.length > 0
            ? `I found ${schemes.length} relevant schemes for you! Here are the results:`
            : `I couldn't find schemes matching "${message}". Try keywords like 'farmer', 'student', 'health', 'women', 'MSME'.`;

        res.json({ 
            reply,
            schemes: schemes.map(s => ({
                name: s.scheme_name,
                category: s.schemeCategory,
                level: s.level,
                benefits: s.benefits?.substring(0, 250),
                eligibility: s.eligibility?.substring(0, 200)
            }))
        });

    } catch (error) {
        console.error("FULL ERROR:", error);
        res.status(500).json({ reply: "Sorry, something went wrong.", error: error.message });
    }
});

export default router;