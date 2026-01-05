import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-50">
      <Card className="w-full max-w-md mx-4 shadow-xl border-slate-100">
        <CardContent className="pt-6">
          <div className="flex mb-4 gap-2 text-red-500 font-bold items-center justify-center">
            <AlertCircle className="h-8 w-8" />
            <h1 className="text-2xl font-display">404 Page Not Found</h1>
          </div>
          
          <p className="mt-4 text-slate-600 text-center text-lg">
            The page you are looking for does not exist.
          </p>

          <div className="mt-8 flex justify-center">
             <Link href="/">
                <Button>Return to Home</Button>
             </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
