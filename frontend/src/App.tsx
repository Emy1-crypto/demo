import { useState } from "react";

export default function App() {
  const [user, setUser]: any = useState(null);
  const [status, setStatus] = useState("Tap Login to continue");

  const authenticate = async () => {
    try {
      const Pi = (window as any).Pi;
      if (!Pi) {
        setStatus("No Pi SDK - Open this in Pi Browser App!");
        return;
      }
      Pi.init({ version: "2.0", sandbox: true });
      setStatus("Authenticating...");
      const auth = await Pi.authenticate(['username', 'payments'], (p:any) => {
        console.log("Incomplete payment:", p);
      });
      setUser(auth.user);
      setStatus("Welcome " + auth.user.username);
    } catch (e: any) {
      console.log(e);
      setStatus("Error: " + (e?.message || JSON.stringify(e)));
    }
  };

  return (
    <div style={{ padding: 20, textAlign: "center" }}>
      <h1>Pi Demo</h1>
      <p>{status}</p>
      <button onClick={authenticate} style={{ padding: "15px 30px", fontSize: 18 }}>
        Login with Pi
      </button>
      {user && <p>Logged in as: {user.username}</p>}
    </div>
  );
}
