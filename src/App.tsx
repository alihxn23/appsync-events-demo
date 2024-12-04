import { useEffect, useState } from "react";
import "./App.css";
import { Amplify } from "aws-amplify";
import { events } from "aws-amplify/data";
import { fetchAuthSession, signOut } from "aws-amplify/auth";
import { withAuthenticator } from "@aws-amplify/ui-react";

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: "your-user-pool-id",
      userPoolClientId: "your-app-client-id",
    },
  },
  API: {
    Events: {
      endpoint: "your-endpoint",
      region: "us-east-1",
      defaultAuthMode: "userPool",
    },
  },
});

export function App() {
  const [messages, setMessages] = useState<
    Array<{ content: string; user: string }>
  >([]);
  const [newMessage, setNewMessage] = useState<string>("");
  const [email, setEmail] = useState<string>("");

  useEffect(() => {
    const getUser = async () => {
      const e =
        (await fetchAuthSession()).tokens?.idToken?.payload.email?.toString() ??
        "unknown";
      setEmail(e);
    };
    getUser();
  }, []);

  const makeConnection = async () => {
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

  // setup ws listener
  useEffect(() => {
    // connect to the websocket endpoint
    const channel = makeConnection();

    //cleanup function
    return () => {
      // close the websocket connection if the component is unmounted
      channel.then((c) => c.close());
    };
  }, []);

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (newMessage.length === 0) return;

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
            <h3
              className="sign-out"
              onClick={() => {
                signOut();
              }}
            >
              Sign Out
            </h3>
          </div>
        </header>
        <main className="chat-container">
          <div className="messages-container">
            {messages.map((msg, i) => (
              <div key={`message-${i}`}>
                <strong className="message-username">
                  {msg.user === email ? "Me" : msg.user}
                </strong>
                <br></br>
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

export default withAuthenticator(App);
