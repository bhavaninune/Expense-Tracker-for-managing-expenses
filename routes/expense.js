const express = require('express');
const router = express.Router();

const expenseController = require('../controller/expense');
router.post('/addexpense',expenseController.addExpense);
router.get('/getexpenses',expenseController.getExpenses);
router.delete('/deleteexpense/:expenseid',expenseController.deleteExpense);
module.exports = router;