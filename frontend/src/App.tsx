import { useState, useEffect } from "react";

export default function App() {
  const [user, setUser]: any = useState(null);
  const [status, setStatus] = useState("Ready");

  useEffect(() => {
    if ((window as any).Pi) {
      (window as any).Pi.init({ version: "2.0", sandbox: true });
      setStatus("Ready - Tap Login in Pi Browser");
    } else {
      setStatus("Open in Pi Browser App, not Chrome");
    }
  }, []);

  const authenticate = async () => {
    try {
      setStatus("Authenticating...");
      const onIncomplete = (payment: any) => {
        console.log(payment);
        return;
      };
      const auth = await (window as any).Pi.authenticate(['username', 'payments'], onIncomplete);
      setUser(auth.user);
      setStatus("Welcome " + auth.user.username);
    } catch (e: any) {
      setStatus("Failed: " + e.message);
    }
  };

  const pay = async () => {
    try {
      setStatus("Creating payment...");
      await (window as any).Pi.createPayment({
        amount: 1,
        memo: "Test payment",
        metadata: { type: "test" }
      }, {
        onReadyForServerApproval: (id: string) => setStatus("Approving " + id),
        onReadyForServerCompletion: (id: string, txid: string) => setStatus("Completed " + txid),
        onCancel: () => setStatus("Cancelled"),
        onError: (err: any) => setStatus("Error " + err.message)
      });
    } catch (e: any) {
      setStatus("Pay error " + e.message);
    }
  };

  return (
    <div style={{ padding: 20, textAlign: "center" }}>
      <h1>Pi Demo</h1>
      <p>{status}</p>
      {!user ? (
        <button onClick={authenticate} style={{ padding: "15px 30px" }}>Login with Pi</button>
      ) : (
        <>
          <p>{user.username}</p>
          <button onClick={pay} style={{ padding: "15px 30px", background: "orange" }}>Test Pay 1 Pi</button>
        </>
      )}
    </div>
  );
}
