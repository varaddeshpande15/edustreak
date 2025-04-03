import "./globals.css";
import { Inter } from "next/font/google";
import Navbar from "@/components/Navbar";
import { getServerSession } from "next-auth";
import AuthProvider from "../utils/AuthProvider";
import ChatBotComponent from "@/components/Chatbot";
const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Edutrack",
  description: "Your personalized healthcare companion.",
};

export default async function RootLayout({ children }) {
  const session = await getServerSession();
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider session={session}> {/* Wrap everything inside AuthProvider */}
          <Navbar /> 
          <ChatBotComponent />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
