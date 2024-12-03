/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from "react";
import config from "../amplifyconfiguration.json";
import "./App.css";
import { Message } from "./models/Message";

export function App() {
  const [messages, setMessages] = useState<Array<Message>>([]);
  const [newMessage, setNewMessage] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  // get user
  useEffect(() => {
    // get logged in user's email and update state
    // setEmail(userEmail);
  }, []);

  // setup ws listener
  useEffect(() => {
    // connect to the websocket endpoint

    //cleanup function
    return () => {
      // close the websocket connection if the component is unmounted
    };
  }, []);

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // send the message here

    // clear newMessage
    setNewMessage("");
  };

  return (
    <>
      <div className="container">
        <header>
          <h1>QuickChat</h1>
          <div>
            <h3>{email}</h3>
            <h3 className="sign-out" onClick={() => {}}>
              Sign Out
            </h3>
          </div>
        </header>
        <main className="chat-container">
          <div className="messages-container">
            {messages.map((msg, i) => (
              <div key={`message-${i}`} className="message">
                <strong className="message-username">
                  {msg.user === email ? "Me" : msg.user}
                </strong>
                <br></br>
                {msg.content}
              </div>
            ))}
          </div>
          <div className="input-container">
            <form onSubmit={handleFormSubmit} className="input-form">
              <input
                type="text"
                placeholder="Type your message"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="message-input"
              />
              <button type="submit" className="send-button">
                Send
              </button>
            </form>
          </div>
        </main>
      </div>
    </>
  );
}

export default App;
