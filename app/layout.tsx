'use client';

import type { Metadata } from "next";
import "primereact/resources/themes/fluent-light/theme.css";
import 'primeicons/primeicons.css';
import 'primereact/resources/primereact.min.css';
import 'primeflex/primeflex.css';
import './styles/styles.css';
import { metadata } from './metadata';


export default function RootLayout({ children }: { children: React.ReactNode }) {
  
  return (
    <html lang="ja">
      <head>
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}