import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
const App: React.FC = () => {
const [piReady, setPiReady] = useState(false);
const [user, setUser] = useState(null);
const [error, setError] = useState('');
const [loading, setLoading] = useState(true);
useEffect(() => {
const initPi = async () => {
await new Promise(r => setTimeout(r, 300));
const Pi = (window as any).Pi;
if (!Pi) {
setError('Pi SDK is loading. Please open this in Pi Browser.');
setLoading(false);
return;
}
try {
await Pi.init({ version: "2.0", sandbox: true });
const auth = await Pi.authenticate(['username'], () => {});
setUser(auth.user);
setPiReady(true);
} catch (err) {
setError('Pi connection failed: ' + err.message);
} finally {
setLoading(false);
}
};
initPi();
}, []);
return (
<div style={{ padding: 20 }}>
{loading ? Loading Pi SDK... : null}
{error ? <p style={{color: 'red'}}>{error} : null}
{piReady ? Pi Ready! User: {user?.username} : null}

);
};
ReactDOM.createRoot(document.getElementById('root')).render(<App />);
