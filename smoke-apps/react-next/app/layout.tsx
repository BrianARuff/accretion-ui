import type { Metadata } from 'next';
import '@accretion-ui/react/styles.css';
import './globals.css';

export const metadata: Metadata = {
  description: 'React SSR smoke validation for the Accretion UI Accordion.',
  title: 'Accretion UI React SSR Smoke',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
