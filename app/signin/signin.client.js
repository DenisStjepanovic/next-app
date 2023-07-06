"use client";
import { useState } from 'react';


const SignInPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSignIn = async (event) => {
        event.preventDefault();

        // Hier kannst du die Anmelde-Logik implementieren, z. B. mit Supabase oder einer anderen Datenbanklösung

        // Beispiel: Überprüfe die Anmeldedaten
        if (email === 'example@example.com' && password === 'password') {
            // Authentifizierung erfolgreich

        } else {
            // Authentifizierung fehlgeschlagen
            alert('Falsche Anmeldedaten'); // Zeige eine Fehlermeldung an
        }
    };

    return (
        <div>
            <h1>Sign In</h1>
            <form onSubmit={handleSignIn}>
                <div>
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Sign In</button>
            </form>
        </div>
    );
};

export default SignInPage;
