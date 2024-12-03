/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from "react";
import { Amplify, ResourcesConfig } from "aws-amplify";
import config from "../amplifyconfiguration.json";
import "./App.css";
import { Message } from "./models/Message";
import { fetchAuthSession, signOut } from "aws-amplify/auth";
import { events } from "aws-amplify/api";
import { withAuthenticator } from "@aws-amplify/ui-react";

Amplify.configure(config as ResourcesConfig);

export function App() {
  const [messages, setMessages] = useState<Array<Message>>([]);
  const [newMessage, setNewMessage] = useState<string>("");
  const [email, setEmail] = useState<string>("");

  // get user
  useEffect(() => {
    // get logged in user's email and update state
    const fetchAndSetEmail = async () => {
      const userEmail =
        (await fetchAuthSession()).tokens?.idToken?.payload.email?.toString() ??
        "unknown";
      setEmail(userEmail);
    };

    fetchAndSetEmail();
  }, []);

  // setup ws listener
  useEffect(() => {
    // connect to the websocket endpoint

    const connectToEndpoint = async () => {
      const channel = await events.connect("/default/test");
      channel.subscribe({
        next: (data) => {
          setMessages((old) => [
            ...old,
            { content: data.event.content, user: data.event.user },
          ]);
        },
        error: (err) => console.error("error", err),
      });
      return channel;
    };

    const channel = connectToEndpoint();

    //cleanup function
    return () => {
      // close the websocket connection if the component is unmounted
      channel.then((e) => e.close());
    };
  }, []);

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // send the message here
    await events.post("/default/test", { content: newMessage, user: email });

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
            <h3 className="sign-out" onClick={() => {signOut()}}>
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

export default withAuthenticator(App);
