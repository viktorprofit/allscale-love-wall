import "./globals.css";

export const metadata = {
  title: "AllScale Love Wall",
  description: "Community tweets and testimonials about AllScale"
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
