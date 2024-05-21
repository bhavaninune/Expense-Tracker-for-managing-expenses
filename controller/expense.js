const express = require('express');
const Expense = require('../models/expense');
const router = express.Router();
const addExpense = async (req, res) => {
    const { expenseamount, description, category } = req.body;

    // if (expenseamount == undefined || expenseamount.length === 0) {
    //     return res.status(400).json({ success: false, message: 'parameters missing' });
    // }

    try {
        const expense = await Expense.create({ expenseamount, description, category });
        return res.status(201).json({ expense, success: true });
    } catch (err) {
        console.log("error creating expense:",err)
        return res.status(500).json({ success: false, error: err });
    }
};

const getExpenses = async (req, res) => {
    try {
        const expenses = await Expense.findAll();
      return  res.status(200).json({ expenses,success:true });  // Make sure it sends back { expenses: [...] }
    } catch (err) {
      return  res.status(500).json({ error:err,success:false });
    }
};

const deleteExpense = (req, res) => {
    const expenseid = req.params.expenseid;
    if(expenseid == undefined || expenseid.length === 0) {
      return res.status(400).json({success:false,})
    }
    Expense.destroy({ where: { id:expenseid } })
        .then(() => {
          return res.status(200).json({success:true, message: "Expense deleted successfully" });
        })
        .catch((err) => {
          return res.status(500).json({success:true,message:"failed"});
        });
}
module.exports = {
    addExpense,
    getExpenses,
    deleteExpense 
};