// src/app/layout.tsx
import { Inter } from "next/font/google";
import "./globals.css";
import { ReactNode } from "react";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "カフェ混雑マップ",
  description: "リアルタイムでカフェやファミレスの混雑状況を確認できるアプリ",
};

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="ja">
      <body className={inter.className}>
        <nav className="bg-blue-600 text-white p-4">
          <div className="container mx-auto flex justify-between items-center">
            <h1 className="text-xl font-bold">カフェ混雑マップ</h1>
            <div className="space-x-4">
              <a href="/" className="hover:underline">
                地図
              </a>
              <a href="/about" className="hover:underline">
                このサービスについて
              </a>
            </div>
          </div>
        </nav>
        <main>{children}</main>
        <footer className="bg-gray-100 p-4 border-t">
          <div className="container mx-auto text-center text-gray-600 text-sm">
            &copy; {new Date().getFullYear()} カフェ混雑マップ -
            全ての権利を留保します
          </div>
        </footer>
      </body>
    </html>
  );
}
