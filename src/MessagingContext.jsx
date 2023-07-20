import { createContext, useEffect, useState } from "react";

export const MessagingContext = createContext(null);

export const MessagingProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [usernameInput, setUsernameInput] = useState("");
  const [contentInput, setContentInput] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [temporaryEditingContent, setTemporaryEditingContent] = useState(""); // TEMPORARY STATE FOR EDITING
  const [error, setError] = useState(null);

  const deepCompare = (a, b) => {
    return JSON.stringify(a) === JSON.stringify(b);
  };

  // WHEN THE APP LOADS, GET ALL MESSAGES
  useEffect(() => {
    // GET REQUEST (POLLING EVERY 1 SECOND)
    setInterval(() => {
      fetch(`${import.meta.env.VITE_MESSAGING_API}/messages`, {
        method: "GET",
      })
        .then((res) => {
          if (!res.ok) {
            throw new Error(`Something went wrong with polling messages request ${res.status} ${res.statusText}`);
          }
          return res.json();
        })
        .then((data) => {
          console.log(data, messages);
          if (deepCompare(data, messages)) {
            return;
          } else {
            setMessages(data);
          }
        })
        .catch((error) => setError(error.message));
    }, 1000);
  }, []);

  // CREATE MESSAGE
  const handleSubmit = (e) => {
    e.preventDefault();

    const message = {
      content: contentInput,
      username: usernameInput,
    };

    fetch(`${import.meta.env.VITE_MESSAGING_API}/messages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(message),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Something went wrong with creating message request ${res.status} ${res.statusText}`);
        }
        return res.json();
      })
      .then((createdMessageFromBackend) => {
        console.log("newDoc received from server", createdMessageFromBackend);
        setMessages([...messages, createdMessageFromBackend]);
      })
      .catch((error) => setError(error.message));
  };

  // PUT MESSAGE
  const startOrFinishEditing = (id) => {
    if (editingId === id) {
      finishEditingAndSaveChangesInServer();
    } else {
      startEditing(id);
    }
  };

  const startEditing = (id) => {
    setEditingId((previous) => (previous === id ? null : id));
    setTemporaryEditingContent(messages.find((message) => message.id === id).content);
  };

  const finishEditingAndSaveChangesInServer = () => {
    setEditingId(null);

    fetch(`${import.meta.env.VITE_MESSAGING_API}/messages/${editingId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ content: temporaryEditingContent }),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Something went wrong with editing message request ${res.status} ${res.statusText}`);
        }
        return res.json();
      })
      .then((updatedMessageFromBackend) => {
        setMessages(messages.map((message) => (message.id === editingId ? updatedMessageFromBackend : message)));
      })
      .catch((error) => setError(error.message));
  };

  // DELETE MESSAGE
  const handleDelete = (id) => {
    fetch(`${import.meta.env.VITE_MESSAGING_API}/messages/${id}`, {
      method: "DELETE",
    }).then((response) => {
      if (response.ok && response.status === 204) {
        setMessages(messages.filter((message) => message.id !== id));
      } else {
        setError(`Something went wrong with deleting message ${response.status} ${response.statusText}`);
      }
    });
  };

  return (
    <MessagingContext.Provider
      value={{
        messages,
        usernameInput,
        contentInput,
        editingId,
        temporaryEditingContent,
        error,
        setUsernameInput,
        setContentInput,
        setEditingId,
        setTemporaryEditingContent,
        setError,
        handleSubmit,
        startOrFinishEditing,
        handleDelete,
      }}
    >
      {children}
    </MessagingContext.Provider>
  );
};
