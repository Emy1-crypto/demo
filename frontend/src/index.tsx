import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client'; // For React 18+
import './index.css'; // If you have global styles (or defaults.css/index.css)

// Note: The Pi SDK is loaded via <script> in public/index.html, so window.Pi is global

const App: React.FC = () => {
  const [piReady, setPiReady] = useState(false);
  const [piUser, setPiUser] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializePi = async () => {
      if (typeof window === 'undefined' || !window.Pi) {
        setErrorMsg('Pi SDK not available. Open in Pi Browser only.');
        setIsLoading(false);
        return;
      }

      try {
        await window.Pi.init({
          version: '2.0',
          sandbox: true, // Enables Test-π payments – remove for mainnet later
        });

        const user = await window.Pi.authenticate(['username', 'payments']);
        setPiUser(user);
        setPiReady(true);
        console.log('Pi ready & authenticated:', user);
      } catch (err: any) {
        console.error('Pi error:', err);
        setErrorMsg(`Pi connection failed: ${err.message || 'Unknown'}. Check Pi Browser & Developer Portal registration.`);
      } finally {
        setIsLoading(false);
      }
    };

    initializePi();
  }, []);

  const handleOrder = async (amount: number, pieName: string) => {
    if (!piReady) {
      setErrorMsg('Pi not ready. Refresh in Pi Browser.');
      return;
    }

    try {
      const paymentData = {
        amount,
        memo: `Pi Bakery: ${pieName}`,
        metadata: { item: pieName },
      };

      const callbacks = {
        onReadyForServerApproval: (paymentId: string) => {
          console.log('Approval ready:', paymentId);
          // Future: send to your backend if needed
        },
        onReadyForServerCompletion: (paymentId: string, txid: string) => {
          alert(`Success! ${pieName} ordered. Tx: ${txid}`);
        },
        onCancel: () => alert('Cancelled.'),
        onError: (error: any) => alert(`Error: ${error.message}`),
      };

      await window.Pi.createPayment(paymentData, callbacks);
    } catch (err: any) {
      alert(`Order failed: ${err.message}`);
    }
  };

  if (isLoading) return <div style={{ textAlign: 'center', padding: '50px' }}>Loading Pi SDK...</div>;

  if (errorMsg) {
    return (
      <div style={{ color: 'red', textAlign: 'center', padding: '30px' }}>
        <p>{errorMsg}</p>
        <button
          onClick={() => window.location.reload()}
          style={{ padding: '10px 20px', background: '#6f42c1', color: 'white', border: 'none', borderRadius: '6px' }}
        >
          Refresh
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ textAlign: 'center', color: '#4a148c' }}>Pi Bakery Demo</h1>

      {piUser ? (
        <p style={{ textAlign: 'center', fontWeight: 'bold' }}>Hi, {piUser.user.username}!</p>
      ) : (
        <button
          onClick={async () => {
            try {
              const user = await window.Pi.authenticate(['username', 'payments']);
              setPiUser(user);
            } catch (err: any) {
              alert('Sign in failed: ' + err.message);
            }
          }}
          style={{
            display: 'block',
            margin: '20px auto',
            padding: '12px 30px',
            background: '#6f42c1',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            cursor: 'pointer',
          }}
        >
          Sign in with Pi
        </button>
      )}

      <div style={{ border: '1px solid #ddd', padding: '20px', margin: '20px 0', borderRadius: '10px', background: '#f9f9f9' }}>
        <h2>Apple Pie</h2>
        <p>You know what this is. Pie. Apples. apple. pie.</p>
        <p><strong>3 Test-π</strong></p>
        <button
          onClick={() => handleOrder(3, 'Apple Pie')}
          style={{ padding: '10px 25px', background: '#6f42c1', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
        >
          Order with Pi
        </button>
      </div>

      <div style={{ border: '1px solid #ddd', padding: '20px', margin: '20px 0', borderRadius: '10px', background: '#f9f9f9' }}>
        <h2>Lemon Meringue Pie</h2>
        <p>Non-contractual picture. Order at your own risk.</p>
        <p><strong>5 Test-π</strong></p>
        <button
          onClick={() => handleOrder(5, 'Lemon Meringue Pie')}
          style={{ padding: '10px 25px', background: '#6f42c1', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
        >
          Order with Pi
        </button>
      </div>

      <p style={{ textAlign: 'center', fontSize: '12px', color: '#666' }}>
        Test mode – uses Test-π. Must be in Pi Browser.
      </p>
    </div>
  );
};

// Render the app (React 18 style – adjust if your original uses ReactDOM.render)
const rootElement = document.getElementById('root');
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(<App />);
} else {
  console.error('Root element not found');
}

export default App; // For potential reuse/tests
