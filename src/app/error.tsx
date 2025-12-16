"use client";

import { Button } from "@/components/ui/button";
import { Frown } from "lucide-react";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="container mx-auto flex h-[calc(100vh-10rem)] items-center justify-center">
      <div className="flex flex-col items-center space-y-4">
        <Frown className="h-16 w-16 text-muted-foreground" />
        <h2 className="text-2xl font-bold font-headline">
          Oops, something went wrong!
        </h2>
        <p className="text-muted-foreground max-w-md text-center">
          An unexpected error occurred. You can try to refresh the page or go
          back to the homepage.
        </p>
        <Button onClick={() => reset()}>Try again</Button>
      </div>
    </div>
  );
}
