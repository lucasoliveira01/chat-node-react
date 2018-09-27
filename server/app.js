const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

const http = require('http');
const socketIo = require('socket.io');

const port = process.env.SOCKET_PORT || 9010;

const server = http.createServer(function (req, res) { 
  res.header("Access-Control-Allow-Origin", 'http://192.168.2.105:9010'); //<--
  res.header("Access-Control-Allow-Credentials", true);
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header("Access-Control-Allow-Headers",
'Origin,X-Requested-With,Content-Type,Accept,content-type,application/json,Authorization');
});
const io = socketIo(server);
// io.origins('http://192.168.2.105:9010') // for latest version

const users = [ ];
io.on('connection', function (socket) {
  let userName;

  socket.on('try-add-user', function (name) {
    if (users.indexOf(name) > -1) {
      return socket.emit('login-error', 'Ja ta dentro esse login!');
    }

    if (!name) {
      return socket.emit('login-error', 'Coloca um login ae!');
    }

    userName = name;
    users.push(name);

    socket.emit('login-success', { user: { name }, allUsers: users });

    const msg = `${name} chegou...`;
    const msgObj = { system: true, date: new Date(), msg };

    socket.broadcast.emit('msg', msgObj);
    socket.emit('msg', msgObj);

    socket.broadcast.emit('user-add', userName);
  });

  socket.on('disconnect', function () {
    if (!userName) return;

    users.splice(users.indexOf(userName), 1);

    const msg = `${userName} saiu fora...`;
    socket.broadcast.emit('msg', { system: true, date: new Date(), msg });
    socket.broadcast.emit('user-remove', userName);
  });

  socket.on('msg', function (msg) {
    const msgObj = { userName, date: new Date(), msg };

    socket.broadcast.emit('msg', msgObj);
    socket.emit('msg', msgObj);
  });
});

server.listen(port);
console.log(`Socket ALIIIIVE on port ${port}`);
