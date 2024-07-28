import React, { useState, useEffect } from "react";
import { Chat } from "./components/Chat";
import { Auth } from "./components/Auth.js";
import { AppWrapper } from "./components/AppWrapper";
import Cookies from "universal-cookie";
import "./App.css";
import { auth } from "./firebase-config"; // Import Firebase auth
import backgroundImage from "./image/aurora.jpg"; // Import the background image

const cookies = new Cookies();

function ChatApp() {
  const [isAuth, setIsAuth] = useState(cookies.get("auth-token"));
  const [isInChat, setIsInChat] = useState(null);
  const [room, setRoom] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (isAuth) {
      const currentUser = auth.currentUser;
      if (currentUser) {
        setUser({
          name: currentUser.displayName,
          photoURL: currentUser.photoURL,
        });
      }
    }
  }, [isAuth]);

  const handleSignOut = () => {
    auth.signOut().then(() => {
      cookies.remove("auth-token");
      setIsAuth(null);
      setIsInChat(false);
    });
  };

  const handleEnterChat = () => {
    if (room.trim() === "") {
      alert("Please type the room name");
      return;
    }
    setIsInChat(true);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleEnterChat();
    }
  };

  if (!isAuth) {
    return (
      <AppWrapper
        isAuth={isAuth}
        setIsAuth={setIsAuth}
        setIsInChat={setIsInChat}
      >
        <Auth setIsAuth={setIsAuth} />
      </AppWrapper>
    );
  }

  return (
    <AppWrapper isAuth={isAuth} setIsAuth={setIsAuth} setIsInChat={setIsInChat}>
      <div
        className="background-image"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          zIndex: -1,
        }}
      ></div>
      <div className="container">
        <div className="dialogue-box">
          {!isInChat ? (
            <div className="room">
              <h2>Type room name:</h2>
              <input
                type="text"
                onChange={(e) => setRoom(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Enter room name.."
              />
              <button onClick={handleEnterChat}>
                Enter Chat
              </button>
            </div>
          ) : (
            <Chat room={room} setIsInChat={setIsInChat}/>
          )}
        </div>
        {isAuth && (
          <div className="sign-out-container">
            <button onClick={handleSignOut} className="sign-out-button">
              Sign Out
            </button>
          </div>
        )}
      </div>
    </AppWrapper>
  );
}

export default ChatApp;
