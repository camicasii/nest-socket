import express from 'express';
import http from 'http';
import { Server } from 'socket.io';

// Configurando la aplicación
const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 3000;

// Almacenar contadores para cada socket
const clients: { [key: string]: number } = {};

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
