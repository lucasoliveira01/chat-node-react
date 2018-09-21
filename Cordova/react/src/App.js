import React, { Component } from 'react';
import { connect, Provider } from 'react-redux';
import moment from 'moment'

import './App.css';

import { actions, store } from './redux';

class FormAddMsg extends Component {
  constructor (props) {
    super(props);

    this.state = { msg: '' };
  }

  render () {
    return (
      <form style={{
        position: "fixed",
        bottom: 0,
        width: "100%",
        background: "white",
        borderTop: "1px solid black",
        padding: 0,
      }} onSubmit={ this.handleSubmit.bind(this) }>
        <input
        placeholder="Digite aqui..."
        style={{
          width: "calc(100% - 70px)",
          height: "40px"
        }}
          onChange={ this.handleChangeInput.bind(this) }
          value={ this.state.msg } />

        <button
        style={{
          float: "right",
          height: "40px",
          fontSize: "13px",
          background: "lightgrey",
          borderRadius: "8px",
          marginRight: "8px",
          marginTop: "3px"
        }}
         type='submit'>enviar</button>
      </form>
    );
  }

  handleSubmit (ev) {
    ev.preventDefault();
    this.props.onSubmit(this.state);
    this.setState({ msg: '' });
  }

  handleChangeInput (ev) {
    this.setState({ msg: ev.target.value });
  }
}

class FormLogin extends Component {
  constructor (props) {
    super(props);

    this.state = { 
     loginName: '',
     errorMsg: "",
     };
  }

  render () {
    return (
      <form onSubmit={ this.handleSubmit.bind(this) }>
        <input
          onChange={ this.handleChangeInput.bind(this) }
          value={ this.state.loginName }
          placeholder={"Usuário"}
          />

        <button type='submit'>Entrar</button>
      </form>
    );
  }

  handleSubmit (ev) {
    ev.preventDefault();
    this.props.onSubmit(this.state);
  }

  handleChangeInput (ev) {
    this.setState({ loginName: ev.target.value });
  }
}

class FormServer extends Component {
  constructor (props) {
    super(props);

    this.state = { 
     ipServer: '',
     };
  }

  render () {
    return (
      <form onSubmit={ this.handleSubmit.bind(this) }>
        <input
          onChange={ this.handleChangeInput.bind(this) }
          value={ this.state.ipServer } 
          placeholder={"Servidor"}
          />

        <button type='submit'>Conectar</button>
      </form>
    );
  }

  handleSubmit (ev) {
    ev.preventDefault();
    this.props.onSubmit(this.state.ipServer);
  }

  handleChangeInput (ev) {
    this.setState({ ipServer: ev.target.value });
  }
}

class ChatRoom extends Component {
  render () {
    return (
      <div>
        <div
          style={ { width: '100%', display: 'flex', flexdirection: 'row' } }
          className='chat-room-wrapper'>

          <div
            style={ { width: '30%', borderLeft: '1px solid #F0F0F0' } }
            className='chat-users'>
            { this.props.chatUsers.map(this.renderUser.bind(this)) }
          </div>

          <div
            style={ { flex: 1 } }
            className='chat-window'>
            { this.props.msgs.map(this.renderMsg.bind(this)) }

            <br />
          </div>
        </div>
        <FormAddMsg onSubmit={ this.handleSubmit.bind(this) } />
      </div>
    );
  }

  handleSubmit (values) {
    actions.msgs.send(values.msg, this.props.socket);
  }

  renderMsg (msg, index) {
    if (msg.system) {
      
      return (
        <p key={ index }>
          [{ moment(msg.date).format("HH:mm") }] { msg.msg }
        </p>
      );
    }

    return (
      <p key={ index }>
        [{ moment(msg.date).format("HH:mm") }] { msg.userName }: { msg.msg }
      </p>
    );
  }

  renderUser (userName, index) {
    return (
      <p key={ index }>
        { userName }
      </p>
    );
  }
}

const ChatRoomContainer = connect((s) => {
  return { msgs: s.msgs, chatUsers: s.chatUsers, socket: s.user.socket };
})(ChatRoom);

class AppContent extends Component {
  render() {
    return (
      <div>
        {
          !this.props.socket ?

          <FormServer onSubmit={ this.handleServer.bind(this) } />
          : !this.props.user ?

          <FormLogin onSubmit={ this.handleSubmit.bind(this) } /> 
          : 
          <ChatRoomContainer /> 
        }
      </div>
    );
  }

  handleSubmit (values) {
    actions.user.tryLogin(values.loginName, this.props.socket);
  }

  handleServer (values) {
    actions.user.registerServer(values);
  }
}

const AppContainer = connect((s) => {
  return { user: s.user.username, socket: s.user.socket };
})(AppContent);

class App extends Component {
  render() {
    return (
      <Provider store={ store }>
        <div className="App">
          <header className="app-header">
            <a href='/'>
              <img className="app-logo" />
            </a>
            <h2 className="title">Fauschat</h2>
          </header>

          <AppContainer />
        </div>
      </Provider>
    );
  }
}

export default App;
