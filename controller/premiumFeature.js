const express = require('express');
const User = require('../models/user');
const Expense = require('../models/expense');
const sequelize = require('../util/database');

const getUserLeaderBoard = async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: ['id', 'name']
        });
        const expenses = await Expense.findAll({
            attributes: ['userId', [sequelize.fn('sum', sequelize.col('expenseamount')), 'total_cost']],
            group: ['userId']
        });

        const userAggregatedExpenses = {};
        expenses.forEach(expense => {
            userAggregatedExpenses[expense.userId] = expense.dataValues.total_cost;
        });

        const userLeaderBoardDetails = users.map(user => ({
            name: user.name,
            total_cost: userAggregatedExpenses[user.id] || 0
        }));

        userLeaderBoardDetails.sort((a, b) => b.total_cost - a.total_cost);

        res.status(200).json(userLeaderBoardDetails);
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
};

module.exports = {
    getUserLeaderBoard
};
