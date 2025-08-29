import type { ReactNode } from 'react';
import './globals.css';

export const metadata = {
  title: 'AI Chat',
  description: 'Simple ChatGPT-like interface'
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, height: '100vh' }}>{children}</body>
    </html>
  );
}
