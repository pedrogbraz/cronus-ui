import { redirect } from "next/navigation";

/** Pro is paused on the public site — old /pro bookmarks land on OSS. */
export default function ProRedirectPage() {
  redirect("/");
}
