const express = require('express');
const cors = require('cors');
const sequelize = require('./util/database'); // Import Sequelize from your database configuration file
//const router = require('./routes/user');

const userRoutes = require('./routes/user');
const expenseRoutes = require('./routes/expense');
const User = require('./models/user');
const Expense = require('./models/expense');
const app = express();

app.use(cors());
app.use(express.json());

//app.use('/', router);
app.use('/user', userRoutes);
app.use('/expense', expenseRoutes);
User.hasMany(Expense);
Expense.belongsTo(User);

sequelize.sync().then(() => {
    app.listen(3003, () => {
        console.log('Server is running on port 3003');
    });
}).catch(err => console.log(err));
