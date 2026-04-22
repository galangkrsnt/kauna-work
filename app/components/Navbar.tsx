import { auth } from "@clerk/nextjs/server";
import NavbarClient from "./NavbarClient";

export default async function Navbar() {
  const { userId } = await auth();
  return <NavbarClient isSignedIn={!!userId} />;
}
