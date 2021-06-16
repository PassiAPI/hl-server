var cors = require('cors')

var express = require('express');
var app = express();
app.use(cors({origin: 'http://localhost:3000'}));
var server = require('http').createServer(app);

const io = require("socket.io")(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

var port = process.env.PORT || 3000;
server.listen(port, function () {

    console.log('Webserver läuft und hört auf Port %d', port);
});




io.on('connection', function (socket) {

    console.log("user connected")

    var addedUser = false;
    
    socket.on('set_type', function (typeid) {

        socket.typeid = typeid

        socket.emit('message', "Type "+ typeid + " ausgewählt");

    });



    socket.on('add user', function (username) {

        socket.username = username;
        addedUser = true;

        socket.emit('login');


        socket.broadcast.emit('user joined', socket.username);
    });

    socket.on('new message', function (data) {

        socket.broadcast.emit('new message', {
            username: socket.username,
            message: data
        });
    });


    socket.on('disconnect', function () {
        if (addedUser) {

            socket.broadcast.emit('user left', socket.username);
        }
    });
});

