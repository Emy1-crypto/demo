import { useState } from 'react';

declare global {
  interface Window { Pi: any; }
}

export default function App() {
  const [user, setUser] = useState<any>(null);
  const [status, setStatus] = useState("");

  const isPiBrowser = typeof window !== 'undefined' && window.Pi;

  const authenticate = async () => {
    if (!window.Pi) {
      setStatus("Please open this link inside Pi Browser app, not Chrome.");
      return;
    }
    try {
      setStatus("Authenticating...");
      window.Pi.init({ version: "2.0", sandbox: true });
      const auth = await window.Pi.authenticate(['username', 'payments'], (payment:any) => {
        console.log("Incomplete payment found:", payment);
      });
      setUser(auth.user);
      setStatus(`Welcome ${auth.user.username}!`);
    } catch (e:any) {
      setStatus("Auth failed: " + e.message);
    }
  };

  const pay = async () => {
    if (!window.Pi) {
      setStatus("Open in Pi Browser to test payment.");
      return;
    }
    try {
      setStatus("Creating payment...");
      await window.Pi.createPayment({
        amount: 1,
        memo: "Test payment for Pi Demo",
        metadata: { type: "test" }
      }, {
        onReadyForServerApproval: (paymentId:string) => {
          setStatus("Payment approved on server...");
        },
        onReadyForServerCompletion: (paymentId:string, txid:string) => {
          setStatus(`Payment completed! TX: ${txid}`);
        },
        onCancel: (paymentId:string) => {
          setStatus("Payment cancelled: " + paymentId);
        },
        onError: (error:any) => {
          setStatus("Payment error: " + error.message);
        }
      });
    } catch (e:any) {
      setStatus("Pay error: " + e.message);
    }
  };

  return (
    <div style={{padding:30, textAlign:'center', fontFamily:'sans-serif', maxWidth:400, margin:'auto'}}>
      <h1>Pi Demo App</h1>
      {!isPiBrowser && <p style={{color:'orange', background:'#fff3cd', padding:10, borderRadius:8}}>Open in Pi Browser for full features</p>}
      {user ? (
        <>
          <h2>Hi, {user.username}!</h2>
          <button onClick={pay} style={{padding:'14px 28px', background:'#6a1b9a', color:'white', border:'none', borderRadius:10, fontSize:16, width:'100%', marginTop:10}}>Pay 1 Pi (Test)</button>
        </>
      ) : (
        <button onClick={authenticate} style={{padding:'14px 28px', background:'#ff8f00', color:'white', border:'none', borderRadius:10, fontSize:16, width:'100%', marginTop:20}}>Login with Pi</button>
      )}
      {status && <p style={{marginTop:20}}>{status}</p>}
      <p style={{marginTop:40, fontSize:12, color:'#888'}}>Build: Fixed | Sandbox: true</p>
    </div>
  );
            }
