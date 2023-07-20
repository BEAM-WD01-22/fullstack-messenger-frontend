import { useContext, useRef, useEffect } from "react";
import { MessagingContext } from "./MessagingContext.jsx";

export default function Messaging() {
  return (
    <div className="w-full h-full  flex-col flex justify-between">
      <Conversation />
      <MessageInput />
    </div>
  );
}

function Conversation() {
  const { messages, editingId, usernameInput, temporaryEditingContent, setTemporaryEditingContent, handleDelete, startOrFinishEditing } = useContext(MessagingContext);
  const bottomRef = useRef();
  useEffect(() => {
    bottomRef.current.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  return (
    <div className="overflow-y-scroll h-[calc(100vh-130px)] flex flex-col">
      {messages
        .sort((a, b) => a.created_at - b.created_at)
        .map((message) => {
          return (
            <div key={message.id} className={`w-[400px] border rounded-full p-5 m-5 border-fuchsia-800 ${message.username == usernameInput ? "self-end" : ""}`}>
              {message.username}:{" "}
              {editingId === message.id ? (
                <input value={temporaryEditingContent} onChange={(e) => setTemporaryEditingContent(e.target.value)} name="content" type="text" />
              ) : (
                <div>{message.content}</div>
              )}
              <button onClick={() => handleDelete(message.id)}>🚮</button>
              <button onClick={() => startOrFinishEditing(message.id)}>🔧</button>
            </div>
          );
        })}
      <div ref={bottomRef} />
    </div>
  );
}

function MessageInput() {
  const { usernameInput, contentInput, setUsernameInput, setContentInput, handleSubmit } = useContext(MessagingContext);

  return (
    <form onSubmit={handleSubmit} className="h-[130px] bg-green-200 flex m-5">
      <input className="border border-1 border-black p-5 w-[250px]" value={usernameInput} onChange={(e) => setUsernameInput(e.target.value)} name="username" type="text" />
      <input className="border border-1 border-black p-5 w-full" value={contentInput} onChange={(e) => setContentInput(e.target.value)} name="content" type="text" />
      <button className="border border-1 border-black p-5 w-[150px]" type="submit">
        Submit
      </button>
    </form>
  );
}
