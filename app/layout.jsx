import "./globals.css";



export const metadata = {
  title: "BankOnRequest",
  description: "BankOnRequest is a simple banking application",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
