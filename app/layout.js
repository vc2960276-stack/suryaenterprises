// app/layout.js
import { Inter } from 'next/font/google';
import Navbar from './components/navbar';
import Footer from './components/footer';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'SURYAENTERPRISES',
  description: 'Leading provider of agricultural solutions in India',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
    <body className={inter.className}>
      <Navbar />
      <main className="min-h-screen">
        {children}
      </main>
      <Footer />
    </body>
  </html>
  );
}