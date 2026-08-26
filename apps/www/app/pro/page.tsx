import { redirect } from "next/navigation";
import { PRO_URL } from "../../lib/site-url";

/** Bookmarks to /pro leave the OSS chrome for the Pro origin. */
export default function ProRedirectPage() {
  redirect(PRO_URL);
}
