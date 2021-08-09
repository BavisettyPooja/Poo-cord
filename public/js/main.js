const socket = io()
const chatForm = document.getElementById('chat-form')
const chatMessages = document.querySelector('.chat-messages')
const {username,room}=Qs.parse(location.search,{
    ignoreQueryPrefix:true
})
const userList=document.getElementById('users')
const roomName=document.getElementById('room-name')
// join the room 
socket.emit('joinRoom',{username,room})
console.log(username,room)

socket.on('message',message =>{
    outputMsg(message)
    //scroll down
    chatMessages.scrollTop=chatMessages.scrollHeight
})
chatForm.addEventListener('submit',e =>{
    e.preventDefault()
    const msg = e.target.elements.msg.value
    socket.emit('chatMessage',msg)

    // clearing the box
    e.target.elements.msg.value='';
    e.target.elements.msg.focus()
})
// get room and users 
socket.on('roomUsers',({room,users})=>{
    outputRoomName(room)
    outputUsers(users)
})
// add room name to DOM
function outputRoomName(room){
    roomName.innerHTML=room
}
function outputUsers(users){
    userList.innerHTML=`${users.map(user => `<li>${user.username}</li>`).join('')}`
}
function outputMsg(message){
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML=`<p class="meta">${message.username} <span>${message.time} </span></p>
    <p class="text">
       ${message.text}
    </p>`
    document.querySelector('.chat-messages').appendChild(div)
}