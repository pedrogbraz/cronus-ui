import { Button } from "@cronus-ui/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@cronus-ui/ui/card";

export default function Page() {
  return (
    <main className="mx-auto flex min-h-screen max-w-xl flex-col items-center justify-center gap-6 p-8">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Cronus UI — external install</CardTitle>
          <CardDescription>
            Rendered from the published @cronus-ui/ui tarball on Tailwind v4.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex gap-3">
          <Button>Primary</Button>
          <Button variant="outline">Outline</Button>
        </CardContent>
      </Card>
    </main>
  );
}
