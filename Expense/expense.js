async function addNewExpense(e) {
    try {
        e.preventDefault();
        const expenseDetails = {
            expenseamount: e.target.expenseamount.value,
            description: e.target.description.value,
            category: e.target.category.value
        };
        console.log(expenseDetails);
        
        const response = await axios.post('http://localhost:3000/expense/addexpense', expenseDetails);
        
        addNewExpensetoUI(response.data.expense);
    } catch (err){showError(err)
    }
};

    

window.addEventListener('DOMContentLoaded', async () => {
    console.log('DOM content loaded');
    try {
        const response = await axios.get('http://localhost:3000/expense/getexpenses');
        response.data.expenses.forEach(expense => {
            addNewExpensetoUI(expense);
        });
    } catch (err) {
        showError(err);
    }
});




function addNewExpensetoUI(expense) {
    const parentElement = document.getElementById('listOfExpenses');
    if (!parentElement) {
        console.error("Parent element not found");
        return;
    }
    const expenseElemId = `expense-${expense.id}`;
    parentElement.innerHTML += `
        <li id="${expenseElemId}">${expense.expenseamount} - ${expense.category} - ${expense.description}
            <button onclick="deleteExpense(event, ${expense.id})">Delete</button>
        </li>`;
}

function deleteExpense(e, expenseid) {
    axios.delete(`http://localhost:3000/expense/deleteexpense/${expenseid}`)
        .then(() => {
            removeExpenseFromUI(expenseid);
        })
        .catch(err => {
            showError(err);
        });
}
function showError(err) {
    console.log(err);
}
function removeExpenseFromUI(expenseid) {
    const expenseElemId = `expense-${expenseid}`;
    const expenseElem = document.getElementById(expenseElemId);
    if (expenseElem) {
        expenseElem.remove();
    }
}
