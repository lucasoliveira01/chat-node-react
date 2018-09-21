import { createStore, combineReducers } from 'redux';
import io from 'socket.io-client';

const socket = (url) => (io.connect(url));

const actionTypes = {
  user: {
    login: 'user_login',
    socket: 'socket'
  },

  chatUsers: {
    load: 'chatUsers_load',
    add: 'chatUsers_add',
    remove: 'chatUsers_remove'
  },

  msgs: {
    add: 'msgs_add'
  }
};

const actions = {
  msgs: {
    send (msg, socket) {
      socket.emit('msg', msg);
    },

    addMessage (msg) {
      dispatch({ type: actionTypes.msgs.add, msg });
    }
  },

  user: {
    tryLogin (username, socket) {
      socket.emit('try-add-user', username);
    },

    login (response) {
      const {
        user,
        allUsers,
      } = response
      dispatch({ type: actionTypes.user.login, username: user.name, users: allUsers.map(u => ({name: u, color: geraCorDoPablo()})) });
    },

    registerServer (ip) {
      let socket = io.connect(ip)
      socket.on('login-success', actions.user.login);
      socket.on('connect_failed', () => console.log('Connection Failed'));

      socket.on('all-users', actions.chatUsers.load);
      socket.on('user-add', actions.chatUsers.add);
      socket.on('user-remove', actions.chatUsers.remove);

      socket.on('msg', actions.msgs.addMessage);

      dispatch({ type: actionTypes.user.socket, socket})
    }
  },

  chatUsers: {

    add (username) {
      dispatch({ type: actionTypes.chatUsers.add, user: {
        name: username,
        color: geraCorDoPablo()
      }});
    },

    remove (username) {
      dispatch({ type: actionTypes.chatUsers.remove, username });
    }
  }
};

function addItemToState (state, item) {
  return [
    ...state,
    item
  ]
}

function addUserToState (state, username) {
  return addItemToState(state, username);
}
function addMsgToState (state, msg)  {
  return addItemToState(state, msg);
}

function removeUserInState (state, username) {
  const newState = [ ...state ];
  newState.splice(newState.indexOf(username), 1);
  return newState;
}

const reducers = {
  user: function (state = {
    socket: null,
    username: ""
  }, action) {
    switch (action.type) {
      case actionTypes.user.login: 
      return {
        ...state,
        username: action.username
      };
      case actionTypes.user.socket:
      return {
        ...state,
        socket: action.socket
      }
      default: return state;
    }
  },

  chatUsers: function (state = [ ], action) {
    switch (action.type) {
      case actionTypes.user.login: return action.users;

      case actionTypes.chatUsers.add:
        return addUserToState(state, action.user);

      case actionTypes.chatUsers.remove:
        return removeUserInState(state, action.username);

      default: return state;
    }
  },

  msgs: function (state = [ ], action) {
    switch (action.type) {
      case actionTypes.msgs.add: return addMsgToState(state, action.msg);
      default: return state;
    }
  },
};

const store = createStore(combineReducers(reducers));
const dispatch = store.dispatch;

export { actions, store };

const geraCorDoPablo = () => {
  var letras = ["0","1","2","3","4","5","6","7","8","9","A","B","C","D","E","F"];
  var cor = "#";
  for(let i = 0; i < 6; i++) {

          cor = cor.concat(letras[Math.floor((Math.random() * 16) )]);
      }
      return cor;
}