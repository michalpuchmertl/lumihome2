const mongoose = require('mongoose');
const emoji = require('node-emoji');

const connectDB = async () => {
  const conn = await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  });

  console.log(
    `${emoji.get('satellite_antenna')} MongoDB Connected: ${
      conn.connection.host
    }`.cyan.bold.underline,
  );
};

module.exports = connectDB;
