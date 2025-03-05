import NavBar from "@/components/custom-ui/NavBar";
import Link from "next/link";

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <NavBar menu={"Offres"} />

      {children}
    </div>
  );
}
