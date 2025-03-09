import NavBar from "@/components/custom-ui/NavBar";

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <NavBar/>

      {children}
    </div>
  );
}
