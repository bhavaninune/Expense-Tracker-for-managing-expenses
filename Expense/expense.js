async function addNewExpense(e) {
    try {
        e.preventDefault();
        const expenseDetails = {
            expenseamount: e.target.expenseamount.value,
            description: e.target.description.value,
            category: e.target.category.value,
            
        };
        console.log(expenseDetails);
        const token = localStorage.getItem('token');
        const response = await axios.post('http://localhost:3003/expense/addexpense', expenseDetails,{ headers: { "Authorization": token } });
        
        addNewExpensetoUI(response.data.expense);
    } catch (err){showError(err)
    }
};

    

window.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    
    axios.get('http://localhost:3003/expense/getexpenses', {
        headers: { "Authorization": token }
    })
    .then(response => {
        response.data.expenses.forEach(expense => {
            addNewExpensetoUI(expense);
        });
    })
    .catch(err => {
        console.log(err);
        showError(err);
    });
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
    const token = localStorage.getItem('token');
    axios.delete(`http://localhost:3003/expense/deleteexpense/${expenseid}`,{ headers: { "Authorization": token } })
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
document.getElementById('rzp-button1').onclick = async function (e) {
    e.preventDefault(); // Prevent the default action

    const token = localStorage.getItem('token');
    try {
        const response = await axios.get("http://localhost:3003/purchase/premiummembership", {
            headers: {"Authorization": token}
        });
        console.log(response);

        var options = {
            "key": response.data.key_id, // Enter the Key ID generated from the Dashboard
            "order_id": response.data.order.id, // For one time payment
            "handler": async function (response) {
                try {
                    const res = await axios.post("http://localhost:3003/purchase/updatetransactionstatus", {
                        order_id: options.order_id,
                        payment_id: response.razorpay_payment_id
                    }, {
                        headers: {"Authorization": token}
                    });

                    alert('You are a premium user now');
                } catch (error) {
                    console.error(error);
                    alert('Something went wrong while updating the transaction status');
                }
            },
            "theme": {
                "color": "#3399cc"
            }
        };

        const rzp1 = new Razorpay(options);
        rzp1.open();

        rzp1.on('payment.failed', function (response) {
            console.log(response);
            alert('Payment failed. Please try again.');
        });

    } catch (error) {
        console.error(error);
        alert('Something went wrong while creating the order');
    }
};
