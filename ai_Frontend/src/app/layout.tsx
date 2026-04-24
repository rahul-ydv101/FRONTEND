import type { Metadata } from "next";
import localFont from "next/font/local";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";
import SmoothScrolling from "@/components/SmoothScrolling";

const epicPro = localFont({
  src: "../../public/epic-pro-font/gc-epicpro.ttf",
  variable: "--font-epic-pro",
});

const bodyFont = Space_Grotesk({
  weight: ['400', '600'],
  subsets: ['latin'],
  variable: '--font-body'
});

export const metadata: Metadata = {
  title: "The Initiative | Deep OS",
  description: "Scrollytelling cinematic experience",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${epicPro.variable} ${bodyFont.variable} font-body antialiased`}
      >
        <SmoothScrolling>
          {children}
        </SmoothScrolling>
      </body>
    </html>
  );
}
