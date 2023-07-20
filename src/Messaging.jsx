import { useContext } from "react";
import { MessagingContext } from "./MessagingContext.jsx";

export default function Messaging() {
  return (
    <div>
      <Conversation />
      <MessageInput />
    </div>
  );
}

function Conversation() {
  const { messages, editingId, temporaryEditingContent, setTemporaryEditingContent, handleDelete, startOrFinishEditing } = useContext(MessagingContext);

  return (
    <div>
      {messages
        .sort((a, b) => a.created_at - b.created_at)
        .map((message) => {
          return (
            <div key={message.id}>
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
    </div>
  );
}

function MessageInput() {
  const { usernameInput, contentInput, setUsernameInput, setContentInput, handleSubmit } = useContext(MessagingContext);

  return (
    <form onSubmit={handleSubmit}>
      <input value={usernameInput} onChange={(e) => setUsernameInput(e.target.value)} name="username" type="text" />
      <input value={contentInput} onChange={(e) => setContentInput(e.target.value)} name="content" type="text" />
      <button type="submit">Submit</button>
    </form>
  );
}
