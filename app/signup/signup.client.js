"use client"
import { useState } from 'react';
import supabase from '../../lib/supabaseClient';

const SignUpPage = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSignUp = async (event) => {
        event.preventDefault();

        // Registriere den Benutzer in der Supabase-Benutzertabelle
        const { data, error } = await supabase.from('users').insert([{ username, email, password }]);

        if (error) {
            // Registrierung fehlgeschlagen
            alert('Fehler bei der Registrierung'); // Zeige eine Fehlermeldung an
        } else {
            // Registrierung erfolgreich
            console.log('Registrierung erfolgreich:', data);
        }
    };

    return (
        <div>
            <h1>Sign Up</h1>
            <form onSubmit={handleSignUp}>
                <div>
                    <label htmlFor="username">Username:</label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="email">E-Mail:</label>
                    <input
                        type="text"
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
                <button type="submit">Sign Up</button>
            </form>
        </div>
    );
};

export default SignUpPage;

