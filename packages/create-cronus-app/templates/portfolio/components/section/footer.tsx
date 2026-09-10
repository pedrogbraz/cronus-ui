import { Globe, Mail, Phone } from "lucide-react";
import { DATA } from "@/data/resume";

export default function Footer() {
  return (
    <footer className="max-w-2xl mx-auto w-full px-4 pb-10 pt-6">
      <div className="border-t border-border pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
        <p>
          © {new Date().getFullYear()} {DATA.name}. All rights reserved.
        </p>

        <div className="flex items-center gap-3">
          {DATA.contact?.email && (
            <a
              href={`mailto:${DATA.contact.email}`}
              className="p-2 rounded-md hover:text-foreground hover:bg-muted transition-colors"
            >
              <Mail className="size-4" />
            </a>
          )}

          {DATA.url && (
            <a
              href={DATA.url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-md hover:text-foreground hover:bg-muted transition-colors"
            >
              <Globe className="size-4" />
            </a>
          )}

          {DATA.contact?.tel && (
            <a
              href={`tel:${DATA.contact.tel}`}
              className="p-2 rounded-md hover:text-foreground hover:bg-muted transition-colors"
            >
              <Phone className="size-4" />
            </a>
          )}
        </div>
      </div>
    </footer>
  );
}
