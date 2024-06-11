const express = require('express');
const User = require('../models/user');
const Expense = require('../models/expense');
const sequelize = require('../util/database');

const getUserLeaderBoard = async (req, res) => {
    try{
        const users=await User.findAll({
            attributes:['id','name']
        });
        const expenses=await Expense.findAll({
            attributes:['userId',[sequelize.fn('sum',sequelize.col('expense.expenseamount')),'total_cost']],
            group:['userID']
        });

        const userAggregatedExpenses = {}
        console.log(expenses)
       // expenses.forEach((expense)=>{
           // if(userAggregatedExpenses[expense.userId])
             //   {
               //     userAggregatedExpenses[expense.userId] = userAggregatedExpenses[expense.userId] + expense.expenseamount;
               // }
               // else{
                //    userAggregatedExpenses[expense.userId] = expense.expenseamount;
                //}
       // })
        var userLeaderBoardDetails=[]
users.forEach((user)=>{
    userLeaderBoardDetails.push({name:user.name,total_cost:userAggregatedExpenses[user.id] || 0})
})


       console.log(userLeaderBoardDetails);
       userLeaderBoardDetails.sort((a,b)=>b.total_cost-a.total_cost)
        res.status(200).json(expenses)
    } catch(err){
        console.log(err);
        res.status(500).json(err)
    }
}

module.exports = {
    getUserLeaderBoard
}
