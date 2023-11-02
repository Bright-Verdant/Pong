const express = require('express')
const app = express()

const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {pingInterval: 2000, pingTimeout: 5000 });

const port = 3000

app.use(express.static('public'))

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html')
})

const players = {
   
}

// is listening for a client server connection and will randomize the player location for a given socket ID
io.on('connection', (socket) => {
  console.log('a user connected');
  players [socket.id] = {
    x: 500 * Math.random(),
    y: 500 * Math.random(),
  }

  // broadcasts a message to all connected clients
  io.emit('updatePlayers', players)

  // is listening for a client disconnnect from the server, will delete and update player info on disconnect
  socket.on('disconnect', (reason) => {
    console.log(reason)
    delete players [socket.id]
    io.emit('updatePlayers', players)
  })

  console.log(players);
})

// starts the server
server.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
