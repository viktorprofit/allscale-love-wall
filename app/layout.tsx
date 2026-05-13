import "./globals.css";

export const metadata = {
  title: "AllScale Feedback Wall",
  description: "Community feedback and reviews about AllScale"
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
