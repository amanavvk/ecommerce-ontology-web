import React from 'react';
import { Inter } from 'next/font/google';
import Navigation from '../components/navigation';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'E-Commerce Ontology',
  description: 'A platform for managing e-commerce ontologies and data.',
};

const Layout = ({ children }) => {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navigation />
        <main>{children}</main>
      </body>
    </html>
  );
};

export default Layout;