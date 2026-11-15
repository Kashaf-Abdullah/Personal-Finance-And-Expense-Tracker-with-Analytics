require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Transaction = require('./models/Transaction');
const Budget = require('./models/Budget');

const demoUsers = [
  {
    username: 'Demo User',
    email: 'demo.user@finance-tracker.test',
    password: 'UserDemo123!',
    role: 'user'
  },
  {
    username: 'Demo Admin',
    email: 'demo.admin@finance-tracker.test',
    password: 'AdminDemo123!',
    role: 'admin'
  }
];

const budgetLimits = {
  Food: 600,
  Housing: 2000,
  Transport: 250,
  Utilities: 250,
  Entertainment: 250
};

function getMonthDate(now, offset, day) {
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + offset, day, 12));
}

async function seedDashboardData(user) {
  const now = new Date();
  const currentMonthExpenses = {};

  for (let monthOffset = -5; monthOffset <= 0; monthOffset += 1) {
    const monthIndex = monthOffset + 5;
    const monthDate = getMonthDate(now, monthOffset, 1);
    const monthKey = `${monthDate.getUTCFullYear()}-${String(monthDate.getUTCMonth() + 1).padStart(2, '0')}`;
    const transactions = [
      { amount: 4500 + monthIndex * 100, category: 'Salary', type: 'income', description: 'Monthly salary', day: 1 },
      { amount: 300 + monthIndex * 30, category: 'Freelance', type: 'income', description: 'Freelance project', day: 8 },
      { amount: 280 + monthIndex * 15, category: 'Food', type: 'expense', description: 'Groceries', day: 5 },
      { amount: 1450, category: 'Housing', type: 'expense', description: 'Rent', day: 2 },
      { amount: 80 + monthIndex * 8, category: 'Transport', type: 'expense', description: 'Public transport', day: 15 },
      { amount: 110 + monthIndex * 5, category: 'Utilities', type: 'expense', description: 'Utilities bill', day: 10 },
      { amount: 70 + monthIndex * 9, category: 'Entertainment', type: 'expense', description: 'Entertainment', day: 20 }
    ];

    for (const transaction of transactions) {
      const date = getMonthDate(now, monthOffset, transaction.day);
      const description = `Demo data: ${transaction.description} (${monthKey})`;
      await Transaction.updateOne(
        { userId: user._id, description, date },
        {
          $setOnInsert: {
            userId: user._id,
            amount: transaction.amount,
            description,
            date,
            category: transaction.category,
            type: transaction.type,
            paymentMethod: 'card'
          }
        },
        { upsert: true }
      );

      if (monthOffset === 0 && transaction.type === 'expense') {
        currentMonthExpenses[transaction.category] = transaction.amount;
      }
    }
  }

  const currentMonth = now.getUTCMonth() + 1;
  const currentYear = now.getUTCFullYear();
  for (const [category, limit] of Object.entries(budgetLimits)) {
    await Budget.updateOne(
      { userId: user._id, category, month: currentMonth, year: currentYear },
      {
        $setOnInsert: {
          userId: user._id,
          category,
          limit,
          currentSpent: currentMonthExpenses[category] || 0,
          month: currentMonth,
          year: currentYear
        }
      },
      { upsert: true }
    );
  }
}

async function seed() {
  if (process.env.NODE_ENV === 'production') {
    throw new Error('Demo users must not be seeded in production.');
  }

  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI must be set before seeding demo users.');
  }

  await mongoose.connect(process.env.MONGO_URI);

  for (const demoUser of demoUsers) {
    let user = await User.findOne({ email: demoUser.email });
    if (user) {
      console.log(`Keeping existing account: ${demoUser.email}`);
    } else {
      user = await User.create(demoUser);
      console.log(`Created ${demoUser.role} demo account: ${demoUser.email}`);
    }

    await seedDashboardData(user);
    console.log(`Ensured dashboard sample data for ${demoUser.email}`);
  }
}

seed()
  .catch((error) => {
    console.error('Failed to seed demo users:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
