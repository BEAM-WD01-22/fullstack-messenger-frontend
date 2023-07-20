import Sidebar from "./Sidebar.jsx";
import Messaging from "./Messaging.jsx";
function App() {
  return (
    <div className="flex max-h-screen max-w-screen h-screen w-screen overflow-hidden">
      {/* {error && <h2 style={{ color: "red" }}>{error}</h2>} */}
      <Sidebar />
      <Messaging />
    </div>
  );
}

export default App;
