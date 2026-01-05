import { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { HeartPulse } from "lucide-react";

export function Layout({ children }: { children: ReactNode }) {
  const [location] = useLocation();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-body">
      {/* Navigation */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="bg-primary/10 p-2 rounded-lg group-hover:bg-primary/20 transition-colors">
              <HeartPulse className="w-6 h-6 text-primary" />
            </div>
            <span className="text-xl font-bold font-display text-slate-900">
              MediFinance <span className="text-primary">Navigator</span>
            </span>
          </Link>

          <nav className="hidden md:flex gap-6">
            <Link 
              href="/" 
              className={`text-sm font-medium transition-colors hover:text-primary ${
                location === "/" ? "text-primary" : "text-slate-600"
              }`}
            >
              Home
            </Link>
            <Link 
              href="/assessment" 
              className={`text-sm font-medium transition-colors hover:text-primary ${
                location === "/assessment" ? "text-primary" : "text-slate-600"
              }`}
            >
              Assessment
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t py-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-slate-500 text-sm">
            © 2024 MediFinance Navigator. This is an MVP and not real financial advice.
          </p>
        </div>
      </footer>
    </div>
  );
}
