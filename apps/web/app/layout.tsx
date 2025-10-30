// import './globals.css';
import { TrpcProvider } from '../src/providers/TrpcProvider';
import { SessionProvider } from "next-auth/react";
import type { Metadata } from "next";


export const metadata : Metadata  = {
  title: 'My App',
  description: 'Next.js + tRPC + Fastify',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <SessionProvider>
        <TrpcProvider>{children}</TrpcProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
