import mongoose from 'mongoose';

// کنکشن کی حالت کو ٹریک کرنے کے لیے ایک ویریبل
let isConnected = false;

export const DB = async () => {
    // اگر پہلے سے کنیکٹڈ ہے تو دوبارہ کنیکٹ کرنے کی ضرورت نہیں
    if (isConnected) {
        console.log("Using existing mongodb connection");
        return;
    }

    try {
        if (!process.env.MONGO_URL) {
            throw new Error('MONGO_URL is not defined in environment variables');
        }

        // ورسل سرور لیس کے لیے بہترین کنکشن آپشنز
        await mongoose.connect(process.env.MONGO_URL, {
            serverSelectionTimeoutMS: 5000, // ۵ سیکنڈ میں کنیکٹ نہ ہو تو ایرر دے
        });

        isConnected = true;
        console.log("✅ mongodb is successfully connected");
    } catch (err) {
        console.log('❌ Mongodb is not Connected:', err);
        throw err; // ایرر کو آگے بھیجیں تاکہ ورسل کو پتہ چلے
    }
};