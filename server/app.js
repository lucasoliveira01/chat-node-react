const http = require('http');
const socketIo = require('socket.io');

const server = http.createServer(function (req, res) {});
const io = socketIo(server);

const port = 9010;

const users = [];



io.on('connection', function (socket) {
  let userName;

  socket.on('try-login', function (name) {
    console.log('login');
    if (users.indexOf(name) > -1) {
      return socket.emit('login-failed', 'Ja tem um login com esse nick na area!');
    }

    userName = name;
    users.push(userName);

    var d = new Date();
    var datestring = d.getHours() + ":" + d.getMinutes();

    const msgObj = {
      system: true,
      msg: `${name} entrou na sala...`,
      date: datestring
    };

    socket.broadcast.emit('msg', msgObj);
    socket.emit('msg', msgObj);

    socket.emit('all-users', users);
    socket.emit('login-success', userName);

    socket.broadcast.emit('add-user', userName);
  });

  socket.on('msg', function (msg) {
    var d = new Date();
    var datestring = d.getHours() + ":" + d.getMinutes();

    const msgObj = {
      userName,
      msg,
      date: datestring
    };

    socket.broadcast.emit('msg', msgObj);
    socket.emit('msg', msgObj);
  });

  socket.on('disconnect', function () {

    if (userName != null) {
      users.splice(users.indexOf(userName), 1);

      socket.broadcast.emit('user-disconnect', userName);
      var d = new Date();
      var datestring = d.getHours() + ":" + d.getMinutes();

      const msgObj = {
        system: true,
        msg: `${userName} saiu da sala... :(`,
        date: datestring
      };

      socket.broadcast.emit('msg', msgObj);
    }
  });
});


server.listen(port);
console.log(`socket alive at ${port}`);