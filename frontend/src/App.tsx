import { useEffect, useState } from "react";

function App() {
  const [status, setStatus] = useState("Checking backend...");

  useEffect(() => {
    fetch("http://localhost:5204/api/health")
      .then((response) => response.json())
      .then((data) => {
        setStatus(`${data.status} — ${data.service}`);
      })
      .catch(() => {
        setStatus("Backend connection failed");
      });
  }, []);

  return (
    <main>
      <h1>Build What Moves India</h1>
      <p>Backend status: {status}</p>
    </main>
  );
}

export default App;