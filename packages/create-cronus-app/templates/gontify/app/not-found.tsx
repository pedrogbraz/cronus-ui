import { HomeIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-[calc(100vh-12rem)] flex flex-col">
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="flex flex-col items-center text-center max-w-md relative">
          <h1
            className="text-[160px] font-black leading-none select-none text-foreground/5 absolute -top-32 left-1/2 -translate-x-1/2"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            404
          </h1>
          <h2
            className="text-3xl font-bold tracking-tight text-foreground mb-2 relative"
            style={{ fontFamily: "'Syne', sans-serif" }}
          >
            Page Not Found
          </h2>
          <p
            className="text-muted-foreground mb-8 text-balance text-sm"
            style={{ fontFamily: "'Outfit', sans-serif" }}
          >
            The page you&apos;re looking for doesn&apos;t exist or may have been moved.
          </p>
          <Link href="/">
            <Button variant="outline" className="gap-2 cursor-pointer">
              <HomeIcon className="h-4 w-4" />
              Go to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
