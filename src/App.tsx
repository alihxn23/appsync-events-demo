/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from "react";
import "./App.css";

export function App() {
  const [messages, setMessages] = useState<Array<{ content: string }>>([]);
  const [newMessage, setNewMessage] = useState<string>("");

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
    if (newMessage.length === 0) return;

    // send the message here

    // clear newMessage
    setNewMessage("");
  };

  return (
    <>
      <div className="container">
        <header>
          <h1>QuickChat</h1>
        </header>
        <main className="chat-container">
          <div className="messages-container">
            {messages.map((msg, i) => (
              <div key={`message-${i}`}>
                <div className="message">{msg.content}</div>
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
