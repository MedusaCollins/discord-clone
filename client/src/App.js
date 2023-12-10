import { useState } from "react";
import Login from "./pages/Login";
import Home from "./pages/Home";

function App() {
  const [islogin, setLogin] = useState(false);
  const [user, setUser] = useState({});

  return (
<div className="bg-primary w-full h-screen">
      {islogin ? (
        <Home user={user}/>
      ) : (
        <div className="flex justify-center items-center h-screen">
          <Login setLogin={setLogin} setUser={setUser} />
        </div>
      )}
    </div>
  );
}

export default App;