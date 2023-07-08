"use client";
import { useState } from 'react';
import supabase from '../../lib/supabaseClient';
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation"

const SignInPage = () => {
    const router = useRouter();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);

    const handleSignIn = async (event) => {
        event.preventDefault();

        const { data: users, error: fetchError } = await supabase
            .from('users')
            .select('username, password')
            .eq('username', username)
            .eq('password', password);

        if (fetchError) {
            console.error('Error:', fetchError);
            setError('An error occurred during sign in');
        } else {
            if (users.length > 0) {
                const signInResponse = await signIn('credentials', {
                    username,
                    password,
                    redirect: false,
                });

                if (signInResponse && !signInResponse.error) {
                    router.push('/');
                } else {
                    console.log('Error:', signInResponse);
                    setError('Your username or password is wrong');
                }
            } else {
                setError('Invalid username or password');
            }
        }
    };

    return (
        <div>
            <h1>Sign In</h1>
            <form onSubmit={handleSignIn}>
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
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                {error && <p>{error}</p>}
                <button type="submit">Sign In</button>
            </form>
        </div>
    );
};

export default SignInPage;