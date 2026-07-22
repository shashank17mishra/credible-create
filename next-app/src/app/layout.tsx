import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  title: "Credible Create — Robotics, AI, & Innovation Education",
  description: "Empowering students and schools through hands-on education in Robotics, AI, IoT, Drone Tech, and Design Thinking. Verify certificates and book school demos.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
        <Script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js" strategy="beforeInteractive" />
        <Script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js" strategy="beforeInteractive" />
        <Script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/MotionPathPlugin.min.js" strategy="beforeInteractive" />
        <Script src="/js/script.js" strategy="lazyOnload" />
      </body>
    </html>
  );
}
