const USER = 'EMAIL';
const ADD_EXPENSE = 'ADD_EXPENSE';
const DEL_EXPENSE = 'DEL_EXPENSE';
const EDIT_EXPENSE = 'EDIT_EXPENSE';
const fetchApi = async () => {
  const result = await fetch('https://economia.awesomeapi.com.br/json/all');
  return result.json().then((values) => values);
};
const userAction = (value) => ({ type: USER, value });
const addExpenseToStore = (value) => ({ type: ADD_EXPENSE, value });
const delExpenseAction = (value) => ({ type: DEL_EXPENSE, value });
const editExpenseAction = (value) => ({ type: EDIT_EXPENSE, value });
const addExpenseAction = (value) => {
  const func = async (dispatch) => {
    const expense = value;
    expense.exchangeRates = await fetchApi();
    delete expense.totalValue;
    delete expense.editState;
    delete expense.expenseNumber;
    dispatch(addExpenseToStore(expense));
  };
  return func;
};
export default { userAction, addExpenseAction, delExpenseAction, editExpenseAction };
