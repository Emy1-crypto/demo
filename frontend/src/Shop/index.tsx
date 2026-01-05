import React from 'react';

const products = [
  {
    id: 1,
    name: 'Apple Pie',
    description: 'You know what this is. Pie. Apples. Apple pie.',
    price: 3,
    image: 'https://www.flickr.com/photos/dan90266/427595611/',
  },
  {
    id: 2,
    name: 'Lemon Meringue Pie',
    description: 'Non-contractual picture. We might have used oranges because we had no lemons. Order at your own risk.',
    price: 5,
    image: 'https://www.flickr.com/photos/94801434@N00/5134246283',
  },
];

const Shop: React.FC = () => {
  const handleSignIn = () => {
    const Pi = (window as any).Pi;
    if (!Pi) {
      alert("Pi SDK not ready—refresh page!");
      return;
    }
    Pi.authenticate(['username'], (auth: any) => {
      alert(`Welcome ${auth.user.username}! 🎉 Signed in!`);
      window.location.reload();
    }).catch((error: any) => {
      console.error(error);
      alert("Sign in failed—try again!");
    });
  };

  const showRewardedAd = async () => {
    try {
      const Pi = (window as any).Pi;
      if (!Pi) {
        alert("Pi SDK not loaded—try again!");
        return;
      }
      let isReady = await Pi.isAdReady("rewarded");
      if (!isReady) {
        await Pi.requestAd("rewarded");
      }
      const response = await Pi.showAd("rewarded");
      if (response?.mediator_ack_status === "granted") {
        alert("Ad watched fully! 🎉 Reward earned! 🥧🌟");
      } else {
        alert("Ad not fully watched—no reward 😔");
      }
    } catch (error) {
      console.error(error);
      alert("Ad not available—try later!");
    }
  };

  return (
    <div style={{ padding: '20px', position: 'relative', textAlign: 'center' }}>
      <button onClick={handleSignIn} style={{ position: 'absolute', top: '10px', right: '10px', padding: '10px 20px', background: '#6a0dad', color: 'white', border: 'none', borderRadius: '10px' }}>
        Sign in
      </button>
      <h1>Pi Bakery</h1>
      <div style={{ display: 'grid', gap: '30px', marginTop: '60px' }}>
        {products.map(product => (
          <div key={product.id} style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '10px' }}>
            <img src={product.image} alt={product.name} style={{ width: '100%', maxHeight: '200px', objectFit: 'cover' }} />
            <h2>{product.name}</h2>
            <p>{product.description}</p>
            <p><strong>{product.price} Test-π</strong></p>
            <button style={{ padding: '10px 20px', background: '#6a0dad', color: 'white' }}>Order</button>
          </div>
        ))}
      </div>

      <div style={{ margin: '60px 0', padding: '30px', background: '#f0e6ff', borderRadius: '15px' }}>
        <h2>Special Reward Offer!</h2>
        <p>Watch a short ad to earn a free reward!</p>
        <button onClick={showRewardedAd} style={{ padding: '20px 40px', fontSize: '22px', backgroundColor: '#6a0dad', color: 'white', border: 'none', borderRadius: '20px' }}>
          Watch Ad for Free Reward!
        </button>
      </div>
    </div>
  );
};

export default Shop;
