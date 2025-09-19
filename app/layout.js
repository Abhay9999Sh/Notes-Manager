import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Notes Manager - Manage Your Personal Notes",
  description: "A simple and efficient notes management application to create, edit, and organize your personal notes",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased font-sans`}
        style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}
      >
        {children}
      </body>
    </html>
  );
}
