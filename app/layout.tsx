import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Thea - AI Email Agent for Your Business",
  description: "Automate customer email responses with AI. Let Thea handle your inbox.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="no">
      <head>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:wght@300;400;500;600;700&display=swap');
          
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          body {
            font-family: 'DM Sans', sans-serif;
            color: #0a0a0f;
            background: #f5f2ec;
          }
          
          h1, h2, h3, h4, h5, h6 {
            font-family: 'Instrument Serif', serif;
          }
        `}</style>
      </head>
      <body>{children}</body>
    </html>
  );
}
