export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="flex min-h-screen w-full justify-center md:items-center bg-lightgray font-inter">
      {children}
    </main>
  );
}
