const mongoose = require('mongoose');
require('dotenv').config();

const ConnectToMongo = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Connecting to MongoDB with URI:', process.env.MONGO_URI);
    } catch (error) {
        console.error("Failed to connect to MongoDB:", error);
    }
};

module.exports = ConnectToMongo;