import type { Metadata } from "next";
import { Inter } from "next/font/google";
import 'github-markdown-css'

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Klotski",
  description: "Klotski is an interesting game, why not making it?",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={[inter.className, 'markdown-body'].join(' ')} style={{maxWidth: '700px', margin: 'auto', padding: '45px'}}>
        {children}
      </body>
    </html>
  );
}
