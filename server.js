const express = require('express')
const path = require('path')
const http = require('http')
const app = express()
const server = http.createServer(app)
const socketio = require('socket.io')
const formatMessage=require('./public/utils/messages')
const {userJoin,getCurrentUser,userLeave,getRoomUsers}=require('./public/utils/users')
const PORT = 3000|| process.env.PORT
app.use(express.static(path.join(__dirname,'public')))
const io =socketio(server)
io.on('connection',socket =>{
    // when user joins a room
    socket.on('joinRoom',({username,room})=>{
        const user = userJoin(socket.id,username,room)
        console.log(user)
        socket.join(user.room)
        socket.emit('message',formatMessage('PooCord Bot','Welcome to PooCord App!'))
    //user connection
    socket.broadcast.to(user.room).emit('message',formatMessage('PooCord Bot',`${user.username} has joined the chat`))
    // Send users and room info
    io.to(user.room).emit('roomUsers', {
        room: user.room,
        users: getRoomUsers(user.room)
      });
    })
    //listening for chatMessage
    socket.on('chatMessage',msg =>{
        const user = getCurrentUser(socket.id)
        io.to(user.room).emit('message',formatMessage(user.username,msg))
    })
     //user disconnection
     socket.on('disconnect',()=>{
        const user = userLeave(socket.id)
        if (user){
            io.to(user.room).emit('message',formatMessage('PooCord Bot',`${user.username} has left the chat`))
        }
        // Send users and room info
        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getRoomUsers(user.room)
        });
    })
})
server.listen(PORT,() => console.log(`Server running on ${PORT}...`))