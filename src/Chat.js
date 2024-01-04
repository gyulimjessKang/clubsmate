import React, { useState, useEffect, useRef } from "react";
import { IoIosClose } from "react-icons/io";
import ChatBubble from "./ChatBubble";
import { firebase } from "./firebase";
import "firebase/auth";
import { FaSyncAlt } from "react-icons/fa";
import "./styles/Chat.css";

const Chat = () => {
  const [showChat, setShowChat] = useState(false);
  const [message, setMessage] = useState("");
  const [user, setUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [userMessageCount, setUserMessageCount] = useState(0);
  const [userMessagesJSON, setUserMessagesJSON] = useState({}); // store user messages in JSON format
  const [refreshChat, setRefreshChat] = useState(false); // chat window refresh status
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (showChat && userMessageCount === 0) {
      setMessages([
        {
          type: "server",
          text:
            "What are your interests and hobbies outside of school? Are there any specific subjects or topics that you are passionate about?",
        },
      ]);
    }
  }, [showChat, userMessageCount]);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({
        behavior: "smooth",
      });
    }
  };

  useEffect(scrollToBottom, [messages]); // Set scroll to move to the bottom whenever the message changes

  const toggleChat = () => {
    setShowChat(!showChat);
  };

  const hideChatBubble = () => {
    setShowChat(false);
  };

  const handleRefreshChat = () => {
    setRefreshChat(true);
  };

  useEffect(() => {
    if (refreshChat) {
      setMessage("");
      setUserMessageCount(0);
      setMessages([
        {
          type: "server",
          text:
            "What are your interests and hobbies outside of school? Are there any specific subjects or topics that you are passionate about?",
        },
      ]);
      setUserMessagesJSON({});
      setRefreshChat(false);
    }
  }, [refreshChat]);

  const submitMessage = async (e) => {
    e.preventDefault();

    const systemMessages = [
      'Roughly how much time can you dedicate to club activities each week? Please give your answer in the form of "X hours".',
      "Do you have a preference for specific weekdays (Monday~Friday) and/or times (flex/lunch/after school)?",
      "Are there any specific goals or skills you would like to develop through club participation?",
      "I am looking for a suitable club for you. Please wait a moment.",
    ];

    if (userMessageCount < 4) {
      setMessages([
        ...messages,
        { type: "user", text: message },
        { type: "server", text: systemMessages[userMessageCount] },
      ]);
      setUserMessagesJSON({
        ...userMessagesJSON,
        [(userMessageCount + 1).toString()]: message,
      }); // User message JSON update
      setUserMessageCount(userMessageCount + 1);

      if (userMessageCount === 3) {
        // Send userMessagesJSON when chat ends
        console.log("4th message : ", message);
        setUserMessagesJSON({ ...userMessagesJSON, ["4"]: message });
      }
    }
    setMessage("");
  };

  useEffect(() => {
    if (userMessageCount === 4) {
      const fetchMessages = async () => {
        console.log(
          `${userMessageCount}.userMessagesJSON : ${userMessagesJSON}`
        );
        try {
          const response = await fetch(
            "https://us-central1-sasclubmn.cloudfunctions.net/sendChatGPT/",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(userMessagesJSON),
            }
          );
          const data = await response.json();
          //   console.log("Success:", data);
          const chatGPTMessage = data.message;
          //   const formattedChatGPTMessage = chatGPTMessage.replace(/\n/g, "\\n");

          setMessages((prevMessages) => [
            ...prevMessages,
            { type: "server", text: chatGPTMessage },
          ]);
        } catch (error) {
          console.error("Error:", error);
        }
      };

      fetchMessages();
    }
  }, [userMessagesJSON, userMessageCount]);

  const isInputDisabled = userMessageCount >= 4;

  return (
    <div>
      {user && (
        <div className="chat-container">
          <div className="chat-wrapper">
            <ChatBubble />
            <img className="sas-logo" src="/img/chatEagleLogo.png" onClick={toggleChat} alt ="eagle logo" />

            {showChat && (
              <div className="chat-window">
                <div className="chat-header">
                  <div className="chat-header-text">
                   Welcome to CLUBSMATE! <span role="img" aria-label="talk emoji  ">
                  💬</span>
                  </div>
                  <div className="chat-header-icon">
                    <div className="refresh-icon" onClick={handleRefreshChat}>
                      <FaSyncAlt />
                    </div>
                    <IoIosClose className="close-icon" onClick={toggleChat} />
                  </div>
                </div>
                <div style={{ padding: "20px", flex: "1", overflowY: "auto" }}>
                  {messages.map((message, i) => (
                    <div
                      key={i}
                      style={{
                        display: "flex",
                        justifyContent:
                          message.type === "user" ? "flex-end" : "flex-start",
                        margin: "9px 0",
                      }}
                    >
                      <div
                        style={{
                          padding: "10px",
                          borderRadius: "8px",
                          backgroundColor:
                            message.type === "user" ? "#A0192A" : "#f0f0f0",
                          color: message.type === "user" ? "white" : "black",
                          textAlign: message.type === "user" ? "right" : "left",
                          maxWidth: "calc(100% - 100px)",
                          wordWrap: "break-word",
                          whiteSpace: "pre-line",
                        }}
                      >
                        {message.text}
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
                <form onSubmit={submitMessage} className="chat-input-form">
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    disabled={isInputDisabled}
                    className="chat-input"
                  />
                  <button
                    type="submit"
                    disabled={isInputDisabled}
                    className="chat-send-button"
                  >
                    Send
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Chat;
