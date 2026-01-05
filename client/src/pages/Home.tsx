import { Link } from "wouter";
import { Layout } from "@/components/ui/Layout";
import { Button } from "@/components/ui/Button";
import { ArrowRight, Activity, Shield, PieChart } from "lucide-react";

export default function Home() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-32">
        {/* Abstract background shapes */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl opacity-50" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-[400px] h-[400px] bg-accent/5 rounded-full blur-3xl opacity-50" />

        <div className="container mx-auto px-4 relative z-10 text-center max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            AI-Powered Medical Cost Predictor
          </div>
          
          <h1 className="text-5xl md:text-7xl font-display font-bold text-slate-900 leading-tight mb-6">
            Navigate Medical Costs <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600">
              With Confidence
            </span>
          </h1>
          
          <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            Don't let medical bills surprise you. Predict hospital costs, understand your insurance coverage, and get personalized financial recommendations in minutes.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/assessment">
              <Button size="lg" className="rounded-full px-8 text-lg group">
                Start Assessment
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Button variant="ghost" size="lg" className="rounded-full text-lg text-slate-500 hover:text-primary">
              Learn How It Works
            </Button>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
                <Activity className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-900">Cost Prediction</h3>
              <p className="text-slate-600">
                Uses advanced machine learning to estimate treatment costs based on your specific condition and location.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mb-6">
                <Shield className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-900">Insurance Analysis</h3>
              <p className="text-slate-600">
                Breaks down complex insurance terms into simple language. Know exactly what's covered and what isn't.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mb-6">
                <PieChart className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-900">Smart Finance</h3>
              <p className="text-slate-600">
                Get actionable financial advice tailored to your income and the predicted gap in your coverage.
              </p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
