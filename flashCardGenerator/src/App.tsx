import { useState } from "react";
import Nav from "./components/Nav";

const App = () => {
  const [getStatus, setStatus] = useState<boolean>(false);

  return <Nav isLoggedIn={getStatus} setStatus={setStatus} /> 
}

export default App;

