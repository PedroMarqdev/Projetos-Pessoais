import React from 'react';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faLightbulb as fasLightbulb } from '@fortawesome/free-solid-svg-icons';
import { faLightbulb as farLightbulb } from '@fortawesome/free-regular-svg-icons';
import PropTypes from 'prop-types';
import actions from '../actions';
import extraFunc from './extraFunc';

class Wallet extends React.Component {
  constructor(props) {
    super(props);
    this.fetchApi = this.fetchApi.bind(this);
    this.totalField = this.totalField.bind(this);
    this.findObjectId = this.findObjectId.bind(this);
    this.state = {
      exchangeRates: {},
      id: 0,
      value: 0,
      description: '',
      currency: 'USD',
      method: 'Cartão de crédito',
      tag: 'Lazer',
      totalValue: 0,
      editState: false,
      expenseNumber: 0,
      darkMode: false,
    };
  }

  componendividMount() {
    this.fetchApi();
  }

  async fetchApi() {
    const result = await fetch('https://economia.awesomeapi.com.br/json/all');
    result.json().then((values) => this.setState({ exchangeRates: values }));
  }

  totalField() {
    const { wallet } = this.props;
    const { expenses } = wallet;
    const result = expenses.reduce((element, next) => {
      const { currency, exchangeRates: rate, value } = next;
      const currencyName = currency;
      const object = Object.entries(rate).find((excha) => excha[0] === currencyName);
      const adjust = 10000;
      const total = parseInt(element * adjust, 10) / adjust;
      const exchange = parseInt(object[1].ask * adjust, 10) / adjust;
      const values = parseInt(value * adjust, 10) / adjust;
      return total + (exchange * values);
    }, 0);
    this.setState(({ totalValue: result }));
  }

  findObjectId(id) {
    const { wallet } = this.props;
    const { expenses } = wallet;
    return expenses.find((element) => element.id === id);
  }

  render() {
    const { discoverName } = extraFunc;
    const { user, addExpense, wallet, delExpense, editExpense } = this.props;
    const { expenses } = wallet;
    const { email } = user;
    const {
      exchangeRates,
      value,
      description,
      currency,
      method,
      tag,
      totalValue,
      editState,
      expenseNumber,
      id,
      darkMode,
    } = this.state;
    return (
      <div className={ `transition-all duration-500 max-h-full min-h-screen ${editState && 'bg-gray-100'} ${darkMode && 'bg-gray-600'}` }>
        <div className="container flex w-screen items-center justify-center mx-auto flex-col">
          <header className={ `transition-all duration-500 flex flex-col rounded-xl w-11/12 bg-white items-center p-4 shadow-sm ${darkMode && 'bg-gray-700'}` }>
            <div className="flex w-full flex-row justify-between items-center">
              <div />
              <h1 className={ `font-bold ml-5 font-mono self-center ${darkMode ? 'text-gray-200' : 'text-gray-500'}` } data-testid="email-field">Email do usuário</h1>
              <FontAwesomeIcon
                onClick={ () => {
                  if (!darkMode) return this.setState({ darkMode: true });
                  this.setState({ darkMode: false });
                } }
                className={ `duration-500 transform fill-current text-gray-200 hover:scale-125 transition-all mr-50 ${!darkMode && 'fill-current text-yellow-300 animate-pulse'}` }
                icon={ darkMode ? farLightbulb : fasLightbulb }
                size="2x"
              />
            </div>
            <h1 className={`font-bold ${darkMode ? 'text-gray-200' : 'text-gray-500'} font-mono` }>{email}</h1>
            <p className={ `font-mono font-bold ${darkMode ? 'text-gray-200' : 'text-gray-500'}` } data-testid="total-field">Valor total</p>
            <div className="flex flex-row">
              <p className="font-mono font-bold text-green-400">
                R$:
                {Number(parseInt(totalValue * 100, 10) / 100).toLocaleString('br')}
              </p>
              <p className="font-mono font-bold text-green-400" data-testid="header-currency-field">BRL</p>
            </div>
          </header>
          <form
            className={
              `${darkMode ? 'bg-gray-700' : 'bg-white'} 
              flex flex-col lg:flex-row lg:flex-wrap my-4
              items-center justify-center shadow-inner w-11/12
              transition-all duration-500 rounded-xl
              ${editState && 'edit-state'}`
            }
          >
            <label className={ `${darkMode ? 'label-class-dark' : 'label-class text-gray-500'} wallet rounded-lg shadow-sm p-2 m-2` } htmlFor="expense">
              Despesa
              <input
                className={ `${darkMode ? 'input-class-dark' : 'input-class text-gray-700'} p-2 m-2 outline-none focus:border-green-400 sm:w-3/4 sm:text-lg` }
                type="number"
                onChange={ ({ target }) => this.setState({ value: target.value }) }
                id="expense"
                data-testid="value-input"
                value={ value }
              />
            </label>
            <label className={ `${darkMode ? 'label-class-dark' : 'label-class text-gray-500'} wallet rounded-lg shadow-sm p-2 m-2` } htmlFor="expenseDescribe">
              Descrição
              <textarea
                placeholder="Descrição do gasto"
                className={ `outline-none ${darkMode ? 'input-class-dark' : 'input-class text-gray-700'} p-2 m-2  sm:w-3/4 sm:text-lg` }
                type="text"
                onChange={ ({ target }) => this.setState({ description: target.value }) }
                id="expenseDescribe"
                data-testid="description-input"
                value={ description }
              />
            </label>
            <label className={ `${darkMode ? 'label-class-dark' : 'label-class text-gray-500'} wallet rounded-lg shadow-sm p-2 m-2` } htmlFor="currency">
              Câmbio
              <select
                className={ `${darkMode ? 'input-class-dark' : 'input-class text-gray-800 bg-white'} p-2 m-2 outline-none focus:border-green-400 sm:w-3/4 sm:text-sm` }
                onChange={ ({ target }) => this.setState({ currency: target.value }) }
                value={ currency }
                data-testid="currency-input"
                id="currency"
              >
                {Object.keys(exchangeRates).map((element) => {
                  if (element !== 'USDT') {
                    return (
                      <option
                        className="text-center rounded-lg"
                        key={ element }
                        data-testid={ element }
                        value={ element }
                      >
                        {element}
                      </option>);
                  }
                  return 'xuxu';
                })}
              </select>
            </label> 
            <label className={ `${darkMode ? 'label-class-dark' : 'label-class text-gray-500'} wallet rounded-lg shadow-sm p-2 m-2` } htmlFor="paymentForm">
              Forma de pagamento
              <select
                className={ `${darkMode ? 'input-class-dark' : 'input-class text-gray-800 bg-white'} p-2 m-2 outline-none focus:border-green-400 sm:w-3/4 sm:text-sm` }
                type="text"
                id="paymentForm"
                data-testid="method-input"
                onChange={ ({ target }) => this.setState({ method: target.value }) }
                value={ method }
              >
                <option>Dinheiro</option>
                <option>Cartão de crédito</option>
                <option>Cartão de débito</option>
              </select>
            </label>
            <label className={ `${darkMode ? 'label-class-dark' : 'label-class text-gray-500'} wallet rounded-lg shadow-sm p-2 m-2` } htmlFor="type">
              Tipo do gasto
              <select
                className={ `${darkMode ? 'input-class-dark' : 'input-class text-gray-800 bg-white'} p-2 m-2 outline-none focus:border-green-400 sm:w-3/4 sm:text-sm` }
                type="text"
                id="type"
                data-testid="tag-input"
                onChange={ async ({ target }) => {
                  this.setState({ tag: target.value });
                } }
                value={ tag }
                onMouseLeave={ this.fetchApi }
              >
                <option>Alimentação</option>
                <option>Lazer</option>
                <option>Trabalho</option>
                <option>Transporte</option>
                <option>Saúde</option>
              </select>
            </label>
            <button
              className={ `expense-button ${editState && 'edit-moment'}` }
              type="button"
              onClick={ async () => {
                if (editState) {
                  await editExpense(this.state);
                  this.totalField();
                  this.setState(({ id: expenseNumber, editState: false, description: '', value: 0 }));
                } else {
                  await addExpense(this.state);
                  await this.setState({
                    description: '',
                    value: 0,
                    expenseNumber: expenseNumber + 1,
                    id: id + 1 });
                  this.totalField();
                }
              } }
            >
              {editState ? 'Editar Despesa' : 'Adicionar Despesa'}
            </button>
          </form>
        </div>
        {!editState && <div className="flex w-screen">
          {/* <thead>
            <tr className="flex bg-white flex-col items-center justify-center p-4 m-4 shadow-inner">
              <th className="text-yellow-300 p-4 font-bold">Descrição</th>
              <th className="text-blue-500 p-4 font-bold">Tag</th>
              <th className="text-purple-600 p-4 font-bold">Método de pagamento</th>
              <th className="text-green-400 p-4 font-bold">Valor</th>
              <th className="text-blue-400 p-4 font-bold">Moeda</th>
              <th className="text-pink-500 p-4 font-bold">Câmbio utilizado</th>
              <th className="text-green-900 p-4 font-bold">Valor convertido</th>
              <th className="text-gray-600 p-4 font-bold">Moeda de conversão</th>
              <th>Editar/Excluir</th>
            </tr>
          </thead> */}
          <div className="flex w-screen items-center justify-center content-center flex-col sm:flex-wrap sm:flex-row">
            {expenses.map((values) => (
              <div className={ `${darkMode ? 'card-container-dark' : 'card-container'}` } key={ values.id }>
                <div className="flex w-11/12 flex-row justify-center items-center">
                  <div className={ `${darkMode ? 'description-class-dark' : 'description-class'}` } key="description">{ values.description }</div>
                </div>
                <div className="card-div">
                  <div className={ `${darkMode ? 'card-title-dark' : 'card-title'}` }>Tipo do gasto</div>
                  <div className={ `${darkMode ? 'card-value-dark' : 'card-value'}` } key="tag">{ values.tag}</div>
                </div>
                <div className="card-div">
                  <div className={ `${darkMode ? 'card-title-dark' : 'card-title break-words'}` }>Forma de pagamento</div>
                  <div className={ `${darkMode ? 'card-value-dark' : 'card-value'}` } key="method">{ values.method}</div>
                </div>
                <div className="card-div">
                  <div className={ `${darkMode ? 'card-title-dark' : 'card-title'}` }>Despesa</div>
                  <div
                    className={ `${darkMode ? 'card-value-dark text-green-400' : 'card-value text-green-400'}` }
                    key="value"
                  >
                    {Number(values.value).toLocaleString('br')}
                  </div>
                </div>
                <div className="card-div">
                  <div className={ `${darkMode ? 'card-title-dark' : 'card-title'}` }>Câmbio</div>
                  <div className={ `${darkMode ? 'card-value-dark' : 'card-value'}` } key="convert">
                    {discoverName(values.currency, values.exchangeRates).name}
                  </div>
                </div>
                <div className="card-div">
                  <div className={ `${darkMode ? 'card-title-dark' : 'card-title'}` }>Câmbio utilizado</div>
                  <div className={ `${darkMode ? 'card-value-dark' : 'card-value'}` } key="current">
                    {discoverName(values.currency, values.exchangeRates).newAsk}
                  </div>
                </div>
                <div className="card-div">
                  <div className={ `${darkMode ? 'card-title-dark' : 'card-title'}` }>Valor convertido</div>
                  <div
                    className={ `${darkMode ? 'card-value-dark text-green-400' : 'card-value text-green-400'}` }
                    key="convertV"
                  >
                    R$:
                    {Number(discoverName(values.currency, values.exchangeRates, values).converted).toLocaleString('br')}
                  </div>
                </div>
                <div className="card-div">
                  <div className={ `${darkMode ? 'card-title-dark' : 'card-title'}` }>Câmbio convertido</div>
                  <div className={ `${darkMode ? 'card-value-dark' : 'card-value'}` } key="currency">Real</div>
                </div>
                <div className="flex w-auto h-auto">
                  <FontAwesomeIcon
                    className={ `${darkMode ? 'edit-icon-dark' : 'edit-icon'}` }
                    size="2x"
                    onClick={ () => {
                      const { value: money, description: desc, currency: curren, method: mediv, tag: tg } = this.findObjectId(values.id);
                      this.setState({ editState: true, id: values.id, value: money, description: desc, currency: curren, method: mediv, tag: tg });
                    } }
                    icon={ faEdit }
                  />
                  <FontAwesomeIcon
                    className={ `${darkMode ? 'delete-icon-dark' : 'delete-icon'}` }
                    size="2x"
                    onClick={ async () => {
                      this.setState({ editState: false });
                      await delExpense(values.id);
                      this.totalField();
                    } }
                    icon={ faTrash }
                  />
                </div>
              </div>
            ))}
          </div>
        </div> }
      </div>);
  }
}

const mapStateToProps = (state) => ({
  user: state.user,
  wallet: state.wallet,
});
const { addExpenseAction, delExpenseAction, editExpenseAction } = actions;
const mapDispatchToProps = (dispatch) => ({
  addExpense: (e) => dispatch(addExpenseAction(e)),
  delExpense: (e) => dispatch(delExpenseAction(e)),
  editExpense: (e) => dispatch(editExpenseAction(e)),
});

Wallet.propTypes = {
  user: PropTypes.objectOf(PropTypes.string).isRequired,
  wallet: PropTypes.shape.isRequired,
  addExpense: PropTypes.func.isRequired,
  delExpense: PropTypes.func.isRequired,
  editExpense: PropTypes.func.isRequired,
};
export default connect(mapStateToProps, mapDispatchToProps)(Wallet);
