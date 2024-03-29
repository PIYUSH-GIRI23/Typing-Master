import { Inter } from "next/font/google";
import "./globals.css";
const inter = Inter({ subsets: ["latin"] });
export const metadata = {
  title: "RapidKeys",
  description: "Boost Your Typing Speed with RapidKeys - The Quickest Path to Keyboard Mastery!",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`{inter.className} bgimage`}>
        {children}
      </body>
    </html>
  );
}
