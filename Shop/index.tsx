import React from 'react';

const products = [
  {
    id: 1,
    name: 'Apple Pie',
    description: 'Delicious apple pie.',
    price: 3,
  },
  {
    id: 2,
    name: 'Lemon Pie',
    description: 'Fresh lemon pie.',
    price: 5,
  },
];

const Shop: React.FC = () => {
  const handleSignIn = () => {
    const Pi = (window as any).Pi;
    if (!Pi) {
      alert("Pi SDK not ready!");
      return;
    }
    Pi.authenticate(['username'], (auth: any) => {
      alert(`Welcome ${auth.user.username}!`);
      window.location.reload();
    });
  };

  const showAd = async () => {
    const Pi = (window as any).Pi;
    if (!Pi) return;
    await Pi.requestAd("rewarded");
    const response = await Pi.showAd("rewarded");
    if (response?.mediator_ack_status === "granted") {
      alert("Reward earned!");
    }
  };

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <button onClick={handleSignIn} style={{ padding: '10px 20px', background: '#6a0dad', color: 'white' }}>
        Sign in with Pi
      </button>
      <h1>Pi Shop</h1>
      {products.map(p => (
        <div key={p.id}>
          <h2>{p.name}</h2>
          <p>{p.description}</p>
          <p>{p.price} π</p>
        </div>
      ))}
      <button onClick={showAd}>
        Watch Ad for Reward
      </button>
    </div>
  );
};

export default Shop;
