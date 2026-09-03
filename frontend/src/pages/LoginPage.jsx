import { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';

export default function LoginPage() { const { signIn } = useAuth(); const [error, setError] = useState(''); const submit = async event => { event.preventDefault(); try { await signIn(Object.fromEntries(new FormData(event.currentTarget))); window.location.href = '/'; } catch (loginError) { setError(loginError.message); } }; return <main><form onSubmit={submit}><h1>Sign in to CareConnect</h1><input name="email" type="email" placeholder="Email" required /><input name="password" type="password" placeholder="Password" required /><button type="submit">Sign in</button>{error && <p>{error}</p>}</form></main>; }
