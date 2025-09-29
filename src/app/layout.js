// This file is the root layout for your Next.js application.

// You don't need to import 'type' definitions in a standard JS file.
// The custom fonts imported here are likely boilerplate and can be removed
// since your fonts are defined in page.js via @font-face.

import "./globals.css"; 

export const metadata = {
  title: "Vitagenerics - Yes, I Fit Campaign",
  description: "The supplement made for how Nigerians live, work, and hustle.",
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
