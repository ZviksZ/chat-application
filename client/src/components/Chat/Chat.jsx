import React, {useState, useEffect} from 'react'
import queryString                  from 'query-string'
import io                           from 'socket.io-client'

import './Chat.css'
import InfoBar                      from "../InfoBar/InfoBar";
import Input                        from "../Input/Input";
import Messages                     from "../Messages/Messages";
import TextContainer                from "../TextContainer/TextContainer";

let socket;

const Chat = ({location}) => {
   const [name, setName] = useState('')
   const [room, setRoom] = useState('')
   const [users, setUsers] = useState([]);
   const [message, setMessage] = useState('')
   const [messages, setMessages] = useState([])
   
   const ENDPOINT = 'https://react-chat-23.herokuapp.com/'

   useEffect(() => {
      const { name, room } = queryString.parse(location.search);

      socket = io(ENDPOINT);

      setRoom(room);
      setName(name);
      
      socket.emit('join', { name, room }, (error) => {
         if(error) {
            alert(error);
         }
      });
      socket.emit('usersLength', { users }, () => {
         alert(users)
      });
   }, [ENDPOINT, location.search]);

   useEffect(() => {
      socket.on('message', (message) => {
         setMessages([...messages, message ]);
      });

      socket.on('roomData', ({ users }) => {
         setUsers(users);
      })

      return () => {
         socket.emit('disconnect');

         socket.off();
      }
   }, [messages])
   
   const sendMessage = (e) => {
      e.preventDefault()
      
      if (message) {
         socket.emit('sendMessage', message, () => setMessage(''))
      } 
   }
   console.log(users)
   
   return (
      <div className="outerContainer">
         <div  className="container">
            <InfoBar room={room}/>
            <Messages messages={messages} name={name}/>
            <Input setMessage={setMessage} sendMessage={sendMessage} message={message}/>
         </div>
         
         <TextContainer users={users}/>
      </div>
   )
}

export default Chat