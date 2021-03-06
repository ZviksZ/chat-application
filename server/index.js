const express = require('express')
const socketio = require('socket.io')
const http = require('http')

const PORT = process.env.PORT || 5000

const router = require('./router')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

io.on('connect', (socket) => {
   console.log('a user connected');

   socket.on('disconnect', () => {
      console.log('a user disconnected');
   });
});

app.use(router)



server.listen(PORT, () => console.log(`Server has started on port: ${PORT}`))










