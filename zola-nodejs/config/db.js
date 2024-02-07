require('dotenv').config();
const mongoose = require('mongoose');

async function connect() {
    try {
        await mongoose.connect(process.env.DATABASE_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log('Connect success');
    } catch (error) {
        console.log('Connect failed', error);
    }
}

module.exports = { connect };
