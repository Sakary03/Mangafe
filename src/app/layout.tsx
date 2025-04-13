import { Inter } from 'next/font/google';
import '../styles/global.css'; // Adjust path to where the file actually is

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Mangaka',
  description: 'A website for manga enthusiasts',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}
