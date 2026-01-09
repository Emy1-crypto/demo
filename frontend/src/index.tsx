import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

const products = [
  {
    id: 1,
    name: 'Apple Pie',
    description: 'You know what this is. Pie. Apples. Apple pie.',
    price: 3,
    image: 'https://images.unsplash.com/photo-1562004760-aceed7bb0d14?auto=format&fit=crop&q=80&w=800',
  },
  {
    id: 2,
    name: 'Lemon Meringue Pie',
    description: 'Fresh and tangy lemon pie with fluffy meringue.',
    price: 5,
    image: 'https://images.unsplash.com/photo-1621947083187-9a4c2d1a4f50?auto=format&fit=crop&q=80&w=800',
  },
];

const App: React.FC = () => {
  const handleSignIn = () => {
    const Pi = (window as any).Pi;
    if (!Pi || !Pi.authenticate) {
      alert("Please open this app in the official Pi Browser to sign in! 😊");
      return;
    }
    Pi.authenticate(['username'], (auth: any) => {
      alert(`Welcome ${auth.user.username}! 🎉 You are signed in!`);
      window.location.reload();
    }).catch(() => {
      alert("Sign in cancelled. Try again!");
    });
  };

  const showRewardedAd = async () => {
    const Pi = (window as any).Pi;
    if (!Pi || !Pi.showAd) {
      alert("Ad rewards only work in the official Pi Browser! 😊");
      return;
    }
    try {
      let isReady = await Pi.isAdReady("rewarded");
      if (!isReady) {
        await Pi.requestAd("rewarded");
      }
      const response = await Pi.showAd("rewarded");
      if (response?.mediator_ack_status === "granted") {
        alert("Ad watched! 🎉 You earned a reward!");
      } else {
        alert("Ad not completed — no reward");
      }
    } catch (error) {
      alert("Ad not available right now.");
    }
  };

  return (
    <div style={{ padding: '20px', textAlign: 'center', fontFamily: 'sans-serif', background: '#f5f5f5', minHeight: '100vh' }}>
      <button 
        onClick={handleSignIn}
        style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          padding: '12px 24px',
          background: '#6a0dad',
          color: 'white',
          border: 'none',
          borderRadius: '12px',
          fontSize: '16px',
          cursor: 'pointer'
        }}
      >
        Sign in with Pi
      </button>

      <h1 style={{ marginTop: '60px', color: '#6a0dad', fontSize: '36px' }}>Pi Bakery Demo</h1>

      <div style={{ display: 'grid', gap: '30px', margin: '40px auto', maxWidth: '900px', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
        {products.map(product => (
          <div key={product.id} style={{ border: '2px solid #ddd', borderRadius: '16px', padding: '20px', background: 'white', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
            <img 
              src={product.image} 
              alt={product.name}
              style={{ width: '100%', height: '300px', objectFit: 'cover', borderRadius: '12px' }}
            />
            <h2 style={{ margin: '20px 0 10px', fontSize: '28px' }}>{product.name}</h2>
            <p style={{ color: '#555', fontSize: '18px' }}>{product.description}</p>
            <p style={{ fontSize: '28px', fontWeight: 'bold', color: '#6a0dad', margin: '20px 0' }}>{product.price} Test-π</p>
            <button style={{ padding: '14px 32px', background: '#6a0dad', color: 'white', border: 'none', borderRadius: '12px', fontSize: '20px', cursor: 'pointer' }}>
              Order with Pi
            </button>
          </div>
        ))}
      </div>

      <div style={{ margin: '80px auto', padding: '40px', background: '#e6d4ff', borderRadius: '20px', maxWidth: '700px', boxShadow: '0 6px 15px rgba(106,13,173,0.2)' }}>
        <h2 style={{ color: '#6a0dad', fontSize: '32px' }}>Special Reward Offer!</h2>
        <p style={{ fontSize: '20px', margin: '20px 0' }}>Watch a short ad to earn a free reward!</p>
        <button 
          onClick={showRewardedAd}
          style={{ padding: '20px 60px', fontSize: '26px', background: '#6a0dad', color: 'white', border: 'none', borderRadius: '20px', cursor: 'pointer' }}
        >
          Watch Ad for Free Reward!
        </button>
      </div>
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(<App />);
