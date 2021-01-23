import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import actions from '../actions/index';

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.validateEmail = this.validateEmail.bind(this);
    this.state = {
      email: '',
      password: '',
      itsOk: true,
    };
  }

  validateEmail() {
    const re = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
    const { email, password } = this.state;
    const result = re.test(email);
    const maxVal = 6;
    if (result && password.length >= maxVal) return this.setState({ itsOk: false });
    this.setState({ itsOk: true });
  }

  render() {
    const { email, password, itsOk } = this.state;
    const { addEmail, history } = this.props;
    return (
      <div className="flex bg-loginBackground bg-100% bg-center bg-no-repeat h-screen items-center justify-center">
        <div className=" flex h-3/4 w-3/4 lg:h-auto lg:w-auto justify-center rounded-lg shadow-xl">
          <form className="flex w-auto h-auto m-12 items-center justify-center flex-col space-y-10">
          <img className="animate-pulse" src="https://fontmeme.com/permalink/210119/644a7733ccebbad700b49720d0797475.png" alt="pixel-fonts" />
            <label className="label-class-login" htmlFor="email">
              Email
              <input
                className="input-class focus:outline-none focus:border-green-400 lg:w-72 lg:text-lg"
                type="email"
                data-testid="email-input"
                id="email"
                value={ email }
                placeholder="Digite seu email"
                onChange={ ({ target }) => {
                  this.setState({ email: target.value });
                } }
                onKeyUp={ this.validateEmail }
                required
              />
            </label>
            <label className="label-class-login" htmlFor="password">
              Senha
              <input
                className="input-class focus:outline-none focus:border-green-400 lg:w-72 lg:text-lg"
                type="password"
                data-testid="password-input"
                id="password"
                value={ password }
                placeholder="Digite sua senha"
                onChange={ async ({ target }) => {
                  await this.setState({ password: target.value });
                } }
                onKeyUp={ this.validateEmail }
                required
              />
            </label>
            <button
              className="disabled:opacity-50 disabled:hover:from-current login-button hover:from-pink-500 duration-500"
              type="button"
              onClick={ () => {
                addEmail(email);
                history.push('./carteira');
              } }
              disabled={ itsOk }
            >
              Entrar
            </button>
          </form>
        </div>
      </div>
    );
  }
}
const { userAction } = actions;
const mapDispatchToProps = (dispatch) => ({
  addEmail: (e) => dispatch(userAction(e)),
});

Login.propTypes = {
  addEmail: PropTypes.func.isRequired,
  history: PropTypes.shape.isRequired,
};
export default connect(null, mapDispatchToProps)(Login);
