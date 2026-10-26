import { useState } from "react";
const Pi = (window as any).Pi;
if (Pi) { Pi.init({ version: "2.0", sandbox: true }); }

export default function App() {
  const [user, setUser]: any = useState(null);
  const [status, setStatus] = useState(Pi ? "Pi SDK Loaded - Tap Login" : "Open in Pi Browser App");

  const authenticate = async () => {
    try {
      if (!Pi) { setStatus("No Pi SDK - open in Pi Browser"); return; }
      setStatus("Authenticating...");
      const auth = await Pi.authenticate(['username', 'payments'], (p:any)=>{ console.log(p); });
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
      <button onClick={authenticate} style={{ padding: "15px 30px", fontSize: 18 }}>Login with Pi</button>
      {user && <p>Logged in as: {user.username}</p>}
    </div>
  );
}
