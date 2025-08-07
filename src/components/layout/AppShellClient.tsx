"use client";
import { useEffect } from "react";
import dynamic from "next/dynamic";
import Script from "next/script";
import Footer from "@/components/layout/Footer/Footer";
import useAppStore from "@/store/store";

const Header = dynamic(() => import("@/components/layout/Header/Header"), { ssr: false });
const Modal = dynamic(() => import("@/components/layout/Modal/Modal"), { ssr: false });
const Chatbot = dynamic(() => import("@/components/ChatBot/ChatBot"), { ssr: false });
const WhatsappLink = dynamic(() => import("@/components/layout/WhatsappLink/WhatsappLink"), { ssr: false });

export default function AppShellClient({ children, lang, structuredData }: { children: React.ReactNode, lang: string, structuredData: any }) {
  // Rehydrate the store after component mounts to avoid SSR mismatches
  useEffect(() => {
    useAppStore.persist.rehydrate();
  }, []);
  
  return (
    <>
      <Script
        id='gtm-script'
        strategy='afterInteractive'
        dangerouslySetInnerHTML={{
          __html: `
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-W7HBVJPC');
          `,
        }}
      />
      <noscript>
        <iframe
          src='https://www.googletagmanager.com/ns.html?id=GTM-W7HBVJPC'
          height='0'
          width='0'
          style={{ display: 'none', visibility: 'hidden' }}
        />
      </noscript>
      <Header />
      <Modal />
      {children}
      <Footer />
      {lang === "he" && <Chatbot locale={lang} />}
      <WhatsappLink />
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
    </>
  );
} 