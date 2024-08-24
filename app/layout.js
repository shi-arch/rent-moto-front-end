'use client';
import "@/styles/globals.css";
import { Link } from "@nextui-org/link";
import clsx from "clsx";
import 'bootstrap/dist/css/bootstrap.css';
import { Provider } from 'react-redux';
import store from "../utils/store";
import { siteConfig } from "@/config/site";
import { fontSans } from "@/config/fonts";
import { NavigationBar } from "@/components/navbar";
import Footer from "../components/footer";
import { Providers } from "@/app/providers";
import Header from "@/components/header";
import "./layout.css"

export default function RootLayout({children}) {
  return (
    <html suppressHydrationWarning lang="en" data-theme="light">
      <head />
      <body
        className={clsx(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable,
        )}
      >
        {/* <Providers themeProps={{ attribute: "class", defaultTheme: "dark" }}> */}
        <Provider store={store}>
        <Providers themeProps={{ attribute: "class", defaultTheme: "light" }}>
            <Header />
            <div style={{ minHeight: "80vh" }}>
              {children}
            </div>
            < Footer />            
        </Providers>
        </Provider>        
      </body>
    </html>
  );
}
