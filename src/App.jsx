import { useEffect, useState } from "react";

function App() {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    fetch("http://localhost:9001/messages")
      .then((res) => res.json())
      .then((data) => setMessages(data));
  }, []);

  useEffect(() => {
    console.log(messages);
  }, [messages]);

  return (
    <>
      {messages
        .sort((a, b) => a.created - b.created)
        .map((message) => {
          return (
            <div key={message.id}>
              {message.created}
              {message.username} says {message.text}
            </div>
          );
        })}
    </>
  );
}

export default App;
