const fs = require('fs');
const mongoose = require('mongoose');
const colors = require('colors');
const emoji = require('node-emoji');
const dotenv = require('dotenv');

// Load env vars
dotenv.config({ path: './config/config.env' });

// Load models
const Debt = require('./models/Debt');
const Transaction = require('./models/Transaction');
const Category = require('./models/Category');
const User = require('./models/User');

// Connect to DB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

// Read JSON files
const debts = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/debts.json`, 'utf-8')
);
const transactions = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/transactions.json`, 'utf-8')
);
const categories = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/categories.json`, 'utf-8')
);
const users = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/users.json`, 'utf-8')
);

// Import into DB
const importData = async () => {
  try {
    await Debt.create(debts);
    await Transaction.create(transactions);
    await Category.create(categories);
    await User.create(users);
    console.log(
      `${emoji.get('seedling')} Data Imported Successfully!`.green.bold
    );
    process.exit();
  } catch (err) {
    console.error(err);
  }
};

// Delete data
const deleteData = async () => {
  try {
    await Debt.deleteMany();
    await Transaction.deleteMany();
    await Category.deleteMany();
    await User.deleteMany();
    console.log(
      `${emoji.get('wastebasket')} Data Destroyed Successfully!`.red.bold
    );
    process.exit();
  } catch (err) {
    console.error(err);
  }
};

if (process.argv[2] === '-i') {
  importData();
} else if (process.argv[2] === '-d') {
  deleteData();
}
