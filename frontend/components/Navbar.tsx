import Link from "next/link";
import { Button } from "@/components/ui/Button";

export function Navbar() {
  return (
    <nav className="w-full border-b border-border bg-background/50 backdrop-blur-md sticky top-0 z-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex-shrink-0">
            <Link href="/" className="text-lg font-semibold tracking-tight text-text-primary">
              GreenGain
            </Link>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {/* Add nav links here if needed */}
            </div>
          </div>
          <div>
            <Link href="/login">
              <Button variant="primary">Log in</Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
