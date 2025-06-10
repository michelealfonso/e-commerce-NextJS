// helper per l'autenticazione

import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { clientPrisma } from "./prisma";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { compare } from "bcrypt";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(clientPrisma),
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials) return null;

        const user = await clientPrisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user) return null;

        const isValid = await compare(credentials.password, user.password);
        if (!isValid) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        return {
          ...token,
          id: user.id,
          email: user.email,
          name: user.name,
        };
      }
      return token;
    },
    async session({ session, token }) {
      console.log("Session callback - Token data:", token);
      if (token) {
        return {
          ...session,
          user: {
            id: token.id as string,
            email: token.email,
            name: token.name,
          },
        };
      }
      return session;
    },
  },
  pages: {
    signIn: "/sign-in",
  },
};


`

1. Configurazione Base
Usa Prisma per gestire il database (crea/modifica utenti)

Usa JWT (JSON Web Tokens) per le sessioni

2. Autenticazione con Email/Password
CredentialsProvider: Permette login con email e password

Cerca l'utente nel database tramite email

Verifica la password con bcrypt (crittografia sicura)

Se tutto ok, ritorna i dati dell'utente (id, email, nome)

3. Gestione Sessioni JWT
jwt callback: Aggiunge id/email/nome al token JWT dopo il login

session callback: Inserisce i dati del token JWT nella sessione utente

4. Extra
Pagina di login personalizzata (/sign-in)

Usa una chiave segreta (NEXTAUTH_SECRET) per firmare i token

In pratica:
Quando fai login, controlla email/password nel DB → se corrette, crea un token JWT → lo salva nei cookie → permette l'accesso alle rotte protette.

I dati dell'utente sono disponibili ovunque tramite useSession() o getServerSession().

`