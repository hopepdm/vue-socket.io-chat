"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var http = require("http");
var socketIo = require("socket.io");
var path = require("path");
var Server = /** @class */ (function () {
    function Server() {
        this.createApp();
        this.config();
        this.createServer();
        this.sockets();
        this.listen();
    }
    Server.prototype.createApp = function () {
        this.app = express();
    };
    Server.prototype.createServer = function () {
        this.server = http.createServer(this.app);
    };
    Server.prototype.config = function () {
        this.port = process.env.PORT || Server.PORT;
        this.app.use('/static', express.static('dist/static'));
        this.app.get('/', function (req, res) {
            res.sendFile(path.join(__dirname, '../dist/index.html'));
        });
    };
    Server.prototype.sockets = function () {
        this.io = socketIo(this.server);
    };
    Server.prototype.listen = function () {
        var _this = this;
        this.server.listen(this.port, function () {
            console.log('Running server on port %s', _this.port);
        });
        this.io.on('connect', function (socket) {
            console.log('Connected client on port %s.', _this.port);
            socket.on('message', function (m) {
                console.log('[server](message): %s', JSON.stringify(m));
                _this.io.emit('message', m);
            });
            socket.on('disconnect', function () {
                console.log('Client disconnected');
            });
        });
    };
    Server.PORT = 8989;
    return Server;
}());
exports.Server = Server;