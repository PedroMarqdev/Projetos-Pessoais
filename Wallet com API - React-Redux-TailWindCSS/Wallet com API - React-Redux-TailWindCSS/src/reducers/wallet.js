const INITIAL_STATE = { currencies: [], expenses: [] };
const ADD_EXPENSE = 'ADD_EXPENSE';
const DEL_EXPENSE = 'DEL_EXPENSE';
const EDIT_EXPENSE = 'EDIT_EXPENSE';

const editFunc = (state, { value }) => {
  const arrayIndex = state.expenses.map((element, index) => {
    if (element.id === value.id) return index;
    return element.id === value.id;
  });
  const indexElement = arrayIndex.filter((element) => typeof element === ('number'));
  const newObject = Object.assign(state.expenses[indexElement], value);
  const newState = Object.assign(state.expenses, newObject);
  console.log(newState);
  return newState;
};
const walletReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
  case ADD_EXPENSE:
    return { currencies: [], expenses: [...state.expenses, action.value] };
  case DEL_EXPENSE:
    return { currencies: [],
      expenses: [...state.expenses.filter((expen) => (expen.id !== action.value))] };
  case EDIT_EXPENSE:
    return { currencies: [],
      expenses: [...editFunc(state, action)] };
  default:
    return state;
  }
};

export default walletReducer;
