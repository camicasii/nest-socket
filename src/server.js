"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
// Configurando la aplicación
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server);
const PORT = 3000;
// Almacenar contadores para cada socket
const clients = {};
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});
// Escuchar nuevas conexiones
io.on('connection', (socket) => {
    console.log('Cliente conectado:', socket.id);
    // Inicializar el contador del cliente
    clients[socket.id] = 0;
    // Informar al cliente de su contador inicial
    socket.emit('init', clients[socket.id]);
    // Manejar el evento de incremento
    socket.on('increment', () => {
        clients[socket.id] += 1;
        // Notificar solo al cliente de su propio nuevo contador
        socket.emit('update', clients[socket.id]);
    });
    // Manejar el evento de Ping
    socket.on('ping', () => {
        clients[socket.id] += 1; // Aumentar contador
        socket.emit('pong', clients[socket.id]); // Responder con Pong
    });

    // Manejar la desconexión del cliente
    socket.on('disconnect', () => {
        console.log('Cliente desconectado:', socket.id);
        delete clients[socket.id];
    });
});
// Iniciar el servidor
server.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
