import type { Metadata } from "next";
import "bootstrap/dist/css/bootstrap.min.css";

import Navbar from "@/components/Navbar";
import {Toaster} from "react-hot-toast";

export const metadata: Metadata = {
  title: "To Do Application",
  description: "CRUD Based Laravel and Next Appliacation",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Toaster />
        <Navbar />
        {children}
      </body>
    </html>
  );
}
