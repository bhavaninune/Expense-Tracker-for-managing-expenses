const express = require('express');
const Expense = require('../models/expense');
const sequelize = require('../util/database');
const User = require('../models/user');
const router = express.Router();
const addExpense = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { expenseamount, description, category } = req.body;

    if (expenseamount == undefined || expenseamount.length === 0) {
      return res.status(400).json({ success: false, message: 'parameters missing' });
    }

    const expense = await Expense.create({ expenseamount, description, category, userId: req.user.id }, { transaction: t });
    const totalExpense = Number(req.user.totalExpenses) + Number(expenseamount);
    
    // Await the update operation
    await User.update({ totalExpenses: totalExpense }, { where: { id: req.user.id }, transaction: t });
    
    await t.commit();
    res.status(201).json({ expense });
  } catch (err) {
    await t.rollback();
    res.status(500).json({ success: false, error: err });
  }
}



const getExpenses = async (req, res) => {
    try {
        const expenses = await Expense.findAll();
      return  res.status(200).json({ expenses,success:true });  // Make sure it sends back { expenses: [...] }
    } catch (err) {
      return  res.status(500).json({ error:err,success:false });
    }
};

const deleteExpense = async (req, res) => {
  const t = await sequelize.transaction();
  try{
      const expenseId = req.params.expenseid;
      if(isstringinvalid(expenseId)) {
          return res.status(400).json({success: false});
      }
      const expensetobedeleted = await Expense.findAll({
          where: { id: expenseId, userId: req.user.id }, transaction: t
      });

      const totalExpense = Number(req.user.totalExpenses) - Number(expensetobedeleted[0].expenseAmount);
      req.user.totalExpenses = totalExpense;
      await req.user.save({transaction: t});

      const noOfRows = await Expense.destroy({ where: {id: expenseId, userId: req.user.id}, transaction: t });
      if(noOfRows === 0) {
          await t.rollback();
          return res.status(404).json({success: false, message: 'Expense does not belongs to user'})
      }
      await t.commit();
      return res.status(200).json({ success: true, message: 'Deleted successfully'})
  } catch(err) {
      await t.rollback();
      console.log(err)
      return res.status(500).json({ success: true, message: 'Failed' });
  }
}

module.exports = {
    addExpense,
    getExpenses,
    deleteExpense 
};
