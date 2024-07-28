import React, { useState, useEffect, useRef } from "react";
import { db, auth } from "../firebase-config";
import {
  collection,
  addDoc,
  where,
  serverTimestamp,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";
import EmojiPicker from 'emoji-picker-react';
import "../styles/Chat.css";

export const Chat = ({ room, setIsInChat }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const messagesRef = collection(db, "messages");
  const chatEndRef = useRef(null);
  const [user, setUser] = useState({
    name: auth.currentUser.displayName,
    photoURL: auth.currentUser.photoURL,
  });

  useEffect(() => {
    const queryMessages = query(
      messagesRef,
      where("room", "==", room),
      orderBy("createdAt")
    );
    const unsuscribe = onSnapshot(queryMessages, (snapshot) => {
      let messages = [];
      snapshot.forEach((doc) => {
        messages.push({ ...doc.data(), id: doc.id });
      });
      console.log(messages);
      setMessages(messages);
    });

    return () => unsuscribe();
  }, [room]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (newMessage.trim() === "") {
      alert("Please type a message before sending.");
      return;
    }

    await addDoc(messagesRef, {
      text: newMessage,
      createdAt: serverTimestamp(),
      user: auth.currentUser.displayName,
      room,
    });

    setNewMessage("");
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSubmit(event);
    }
  };

  const handleEmojiClick = (emojiData) => {
    setNewMessage(prevMessage => prevMessage + emojiData.emoji);
    setShowEmojiPicker(false);
  };

  return (
    <div className="chat-app">
      <div className="profile-container" style={styles.profileContainer}>
        <div className="profile-header" style={styles.profileHeader}>
          <img
            src={user.photoURL}
            alt="User Profile"
            style={styles.profilePicture}
          />
          <span style={styles.profileName}>{user.name}</span>
        </div>
      </div>
      <div className="chat-header" style={styles.chatHeader}>
        <h1 style={styles.welcomeText}> </h1>
      </div>
      <div className="messages">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`message ${message.user === auth.currentUser.displayName ? "user-message" : "other-message"}`}
          >
            <span className="user-name">{message.user} :</span>
            <div className="message-text">{message.text}</div>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>
      <form onSubmit={handleSubmit} className="new-message-form">
        <button
          type="button"
          className="emoji-button"
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
        >
          <img
            src="/image/emoji.png"
            alt="Emoji Picker"
            style={styles.emojiIcon}
          />
        </button>
        {showEmojiPicker && (
          <div className="emoji-picker-container">
            <button
              type="button"
              className="close-emoji-picker"
              onClick={() => setShowEmojiPicker(false)}
            >
              &times; {/* Unicode character for '×' */}
            </button>
            <EmojiPicker onEmojiClick={handleEmojiClick} />
          </div>
        )}
        <input
          type="text"
          value={newMessage}
          onChange={(event) => setNewMessage(event.target.value)}
          onKeyDown={handleKeyPress}
          className="new-message-input"
          placeholder="Type your message here..."
        />
        <button type="submit" className="send-button">
          Send
        </button>
      </form>
      <div className="back-to-room-container">
        <button onClick={() => setIsInChat(false)} className="back-to-room-button">
          Back to Room Input
        </button>
      <div className="chat-header" style={styles.chatHeader}>
        <h1 style={styles.welcomeText}>Room Name:{room}</h1>
      </div>
      </div>
    </div>
  );
};

const styles = {
  profileContainer: {
    position: 'absolute',
    left: '20px',
    top: '20px',
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#222',
    padding: '10px',
    borderRadius: '5px',
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)',
  },
  profileHeader: {
    display: 'flex',
    alignItems: 'center',
  },
  profilePicture: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    marginRight: '10px',
  },
  profileName: {
    fontSize: '14px',
    color: '#aaa',
  },
  chatHeader: {
    display: 'center',
    justifyContent: 'flex-end', // Align content to the right
    padding: '10px 0',
    marginTop: '20px',
    fontSize: '20px'
  },
  welcomeText: {
    fontFamily: 'Roboto Mono, monospace', // Apply the funky font here
    fontSize: '35px', // Adjust size as needed
    color: 'white', // Adjust color as needed
  },
  emojiIcon: {
    width: '36px', // Adjust size as needed
    height: '36px',
  }
};
