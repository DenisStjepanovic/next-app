
import CredentialsProvider from "next-auth/providers/credentials";
import supabase from './supabaseClient';

export const NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Username",
            credentials: {
                username: {
                    label: "Username",
                    type: "text",
                },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials || !credentials.username || !credentials.password) {
                    return null;
                }


                return null;
            }
        })
    ],
}