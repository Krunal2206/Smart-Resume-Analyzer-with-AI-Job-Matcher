import { auth } from "@/lib/auth"; // your server-side auth config
import NavbarClient from "./NavbarClient";

export default async function Navbar() {
  const session = await auth();

  return <NavbarClient session={session} />;
}
