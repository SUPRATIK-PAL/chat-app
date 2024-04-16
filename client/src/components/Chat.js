import React from 'react'
import { useState, useEffect } from 'react';
import { MentionsInput, Mention } from 'react-mentions';
import Picker from 'emoji-picker-react'
import io from 'socket.io-client';
import "./Styles.css"
import { AiFillLike } from "react-icons/ai";



const Chat = () => {
  const socket = io('http://localhost:3001');
    const [messages, setMessages] = useState([]);
 const [input, setInput] = useState('');
 const [showModal, setShowModal] = useState(false);
 const [mentionIndex, setMentionIndex] = useState(null);
 const[showLike, setShowLike] = useState(false);
 const users = ["Alan", "Bob", "Carol", "Dean", "Elin"];

 useEffect(() => {

  const handleChatMessage = (msg) => {
     setMessages((prevMessages) => [...prevMessages, msg]);
  };

  socket.on('chat message', handleChatMessage);

  const handleMessageSent = (msg) => {
    setMessages(() => [msg]);
  };
 

  socket.on('message sent', handleMessageSent);
 
 
  return () => {
     socket.off('chat message', handleChatMessage);
    socket.off('message sent', handleMessageSent);
  };
 }, []);
 

const handleChange = (e) => {
    const inputMessage = e.target.value;
    setInput(inputMessage);


    const atIndex = inputMessage.lastIndexOf('@');
    if (atIndex !== -1 && atIndex === inputMessage.length - 1) {
      setShowModal(true);
      setMentionIndex(atIndex);
    } else {
      setShowModal(false);
      setMentionIndex(null);
    }
}


 const handleEmojiClick = (event) => {
  console.log(event.emoji);
  setInput(prev => prev + event.emoji);
 }


 const closeModal = () => {
    setShowModal(false);
    setMentionIndex(null);
 }

 const sendMessage = () => {
    socket.emit('chat message', input);
    var currentDate = new Date();


var hours = currentDate.getHours();
var minutes = currentDate.getMinutes();
var seconds = currentDate.getSeconds();

hours = (hours < 10 ? "0" : "") + hours;
minutes = (minutes < 10 ? "0" : "") + minutes;
seconds = (seconds < 10 ? "0" : "") + seconds;


var currentTime = hours + ":" + minutes + ":" + seconds;

console.log(currentTime);
    const randomUser = users[Math.floor(Math.random() * users.length)];
    const newMessage = {
      user: randomUser,
      text: input,
      likes: 0,
      time: currentTime
    };
    setMessages([...messages, newMessage]);
    setInput('');
 };

 const [showPicker, setShowPicker] = useState(false);


const handleUserClick = (user) => {
  const updatedMessage =
      input.substring(0, mentionIndex) + user + ' ' + input.substring(mentionIndex + 1);
    setInput(updatedMessage);
    setShowModal(false);
    setMentionIndex(null);
}


 
 const likeMessage = (index) => {
    const newMessages = [...messages];
    newMessages[index].likes += 1;
    setMessages(newMessages);
    setShowLike(true);
    setTimeout(() => {
      setShowLike(false);
    }, 2000);
 };

 return (
  <div className="chat-container">
    <div className='heading'>
      <h1>Chat App</h1>
    </div>
    <div className="message-container">
      <div className='message-area'>
        <div className='message-section'>
          {messages.map((message, index) => (
            <div key={index} className="message">
              <div className='message-heading'>
                <span className="username">{message.user} </span>
              </div>
              <div className='message-field'>
                <div className='text'>
                  <p>{message.text}</p>
                  <span>{message.time}</span>
                </div>
                <div className='like-section'>
                  <AiFillLike onClick={() => likeMessage(index)} /> 
                  {
    showLike && <span>{message.likes}</span>
  }

                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className='input-section'>
          <div className="input-container">
              <input
                className="message-input"
                value={input}
                onChange={handleChange}
                placeholder="Type a message..."
              />
              <button className="send-button" onClick={sendMessage}>Send</button>
              <button className="emoji-button" onClick={() => setShowPicker(!showPicker)}>😀</button>
          </div>
            {showModal && (
              <div className='modal-section'>
                <div className="modal">
                  <div className="modal-content">
                    <span className="close" onClick={closeModal}>&times;</span>
                    <ul>
                      {users.map((user, index) => (
                        <li key={index} onClick={() => handleUserClick(user)}>{user}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
      </div>
      <div className='emoji-section'>
        {showPicker && <Picker onEmojiClick={handleEmojiClick} />}

      </div>
    </div>
  </div>
);
    
}

export default Chat
