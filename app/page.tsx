import { redirect } from "next/navigation";

/** Kök adres iç panele gider; kimlik kontrolü proxy.ts'te. */
export default function HomePage() {
  redirect("/panel");
}
