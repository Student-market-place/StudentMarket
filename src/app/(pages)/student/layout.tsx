import NavBar from "@/components/custom-ui/NavBar";

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col gap-5">
      <NavBar/>

      {children}
    </div>
  );
}
