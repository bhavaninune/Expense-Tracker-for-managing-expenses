const express = require('express');
const cors = require('cors');
const sequelize = require('./util/database'); // Import Sequelize from your database configuration file
//const router = require('./routes/user');

const userRoutes = require('./routes/user');
const expenseRoutes = require('./routes/expense');
const purchaseRoutes = require('./routes/purchase');
const premiumFeatureRoutes = require('./routes/premiumFeature');

const User = require('./models/user');
const Expense = require('./models/expense');
const Order = require('./models/order');

const app = express();

app.use(cors());
require('dotenv').config();


app.use(express.json());

//app.use('/', router);
app.use('/user', userRoutes);
app.use('/expense', expenseRoutes);
app.use('/purchase',purchaseRoutes);
app.use('/premium', premiumFeatureRoutes);
User.hasMany(Expense);
Expense.belongsTo(User);

User.hasMany(Order);
Order.belongsTo(User);

sequelize.sync().then(() => {
    app.listen(3003, () => {
        console.log('Server is running on port 3003');
    });
}).catch(err => console.log(err));
