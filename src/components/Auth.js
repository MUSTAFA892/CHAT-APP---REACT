import React from "react";
import { auth, provider } from "../firebase-config.js";
import { signInWithPopup } from "firebase/auth";
import Cookies from "universal-cookie";
import styled from "styled-components"; // Import styled-components

const cookies = new Cookies();

// Styled-component for aurora effect
const AuroraBackground = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  color: white;
  background: linear-gradient(#140729, #224471 80%, #30879a 97%, #1ea59e 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  overflow: hidden;
`;

// Styled-component for the Auth content
const AuthContent = styled.div`
  z-index: 1;
  background: rgba(0, 0, 0, 0.6);
  padding: 20px;
  border-radius: 10px;
  text-align: center;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);

  p {
    margin-bottom: 20px;
    font-size: 1.2rem;
  }

  button {
    background-color: #4285f4;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 5px;
    cursor: pointer;
    font-size: 1rem;
    transition: background-color 0.3s;

    &:hover {
      background-color: #357ae8;
    }
  }
`;

export const Auth = ({ setIsAuth }) => {
  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      cookies.set("auth-token", result.user.refreshToken);
      setIsAuth(true);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <AuroraBackground>
      <AuthContent>
        <p>Sign In With Google To Continue</p>
        <button onClick={signInWithGoogle}>Sign In With Google</button>
      </AuthContent>
    </AuroraBackground>
  );
};
