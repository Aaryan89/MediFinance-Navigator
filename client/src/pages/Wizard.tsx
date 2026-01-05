import { useState } from "react";
import { Layout } from "@/components/ui/Layout";
import { WizardStep } from "@/components/WizardStep";
import { Button } from "@/components/ui/Button";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence } from "framer-motion";
import { ChevronRight, ChevronLeft, Check } from "lucide-react";
import { 
  usePredictCost, 
  useCheckInsurance, 
  useRecommendFinance 
} from "@/hooks/use-finance";
import {
  CostCard,
  InsuranceCard,
  RecommendationCard
} from "@/components/ResultsCards";

// --- Form Schemas ---
const step1Schema = z.object({
  condition: z.string().min(1, "Please select a condition"),
  city: z.string().min(1, "Please select a city"),
  hospital_type: z.string().min(1, "Please select a hospital type"),
  room_type: z.string().min(1, "Please select a room type"),
  age: z.coerce.number().min(0, "Age must be valid").max(120),
});

const step2Schema = z.object({
  coverage_amount: z.coerce.number().min(0, "Amount must be valid"),
  copay_percent: z.coerce.number().min(0).max(100),
});

const step3Schema = z.object({
  monthly_income: z.coerce.number().min(0, "Income must be valid"),
});

// --- Main Component ---
export default function Wizard() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<any>({});
  const [results, setResults] = useState<any>({});

  // Hooks
  const predictMutation = usePredictCost();
  const insuranceMutation = useCheckInsurance();
  const recommendMutation = useRecommendFinance();

  // Step 1 Form
  const form1 = useForm({
    resolver: zodResolver(step1Schema),
    defaultValues: {
      condition: "",
      city: "",
      hospital_type: "Private",
      room_type: "Semi-Private",
      age: "" as any,
    }
  });

  // Step 2 Form
  const form2 = useForm({
    resolver: zodResolver(step2Schema),
    defaultValues: {
      coverage_amount: "" as any,
      copay_percent: 10,
    }
  });

  // Step 3 Form
  const form3 = useForm({
    resolver: zodResolver(step3Schema),
    defaultValues: {
      monthly_income: "" as any,
    }
  });

  // Handlers
  const handleStep1 = async (data: any) => {
    try {
      const pred = await predictMutation.mutateAsync(data);
      setFormData((prev: any) => ({ ...prev, ...data }));
      setResults((prev: any) => ({ ...prev, prediction: pred }));
      setStep(2);
    } catch (e) {
      console.error(e);
    }
  };

  const handleStep2 = async (data: any) => {
    try {
      const ins = await insuranceMutation.mutateAsync(data);
      setFormData((prev: any) => ({ ...prev, ...data }));
      setResults((prev: any) => ({ ...prev, insurance: ins }));
      setStep(3);
    } catch (e) {
      console.error(e);
    }
  };

  const handleStep3 = async (data: any) => {
    try {
      const rec = await recommendMutation.mutateAsync({
        predicted_avg_cost: results.prediction.avg_cost,
        insurance_coverage: formData.coverage_amount,
        monthly_income: data.monthly_income,
      });
      setFormData((prev: any) => ({ ...prev, ...data }));
      setResults((prev: any) => ({ ...prev, recommendation: rec }));
      setStep(4); // Results page
    } catch (e) {
      console.error(e);
    }
  };

  const isLoading = predictMutation.isPending || insuranceMutation.isPending || recommendMutation.isPending;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        {/* Progress Bar */}
        <div className="max-w-xl mx-auto mb-12">
          <div className="flex justify-between mb-2">
            {[1, 2, 3, 4].map((s) => (
              <div 
                key={s}
                className={`text-xs font-bold uppercase tracking-wider ${
                  step >= s ? "text-primary" : "text-slate-300"
                }`}
              >
                {s === 4 ? "Results" : `Step ${s}`}
              </div>
            ))}
          </div>
          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary transition-all duration-500 ease-out"
              style={{ width: `${((step - 1) / 3) * 100}%` }}
            />
          </div>
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <WizardStep key="step1" title="Medical Details" description="Tell us about the condition and facility preference.">
              <form onSubmit={form1.handleSubmit(handleStep1)} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Condition</label>
                    <select 
                      {...form1.register("condition")}
                      className="w-full p-3 rounded-lg border bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                    >
                      <option value="">Select Condition</option>
                      <option value="cardiac_surgery">Cardiac Surgery</option>
                      <option value="typhoid">Typhoid</option>
                      <option value="cataract_surgery">Cataract Surgery</option>
                      <option value="dialysis">Dialysis</option>
                      <option value="knee_replacement">Knee Replacement</option>
                    </select>
                    {form1.formState.errors.condition && (
                      <p className="text-xs text-red-500">{form1.formState.errors.condition.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">City</label>
                    <select 
                      {...form1.register("city")}
                      className="w-full p-3 rounded-lg border bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                    >
                      <option value="">Select City</option>
                      <option value="Chennai">Chennai</option>
                      <option value="Delhi">Delhi</option>
                      <option value="Pune">Pune</option>
                      <option value="Hyderabad">Hyderabad</option>
                      <option value="Jaipur">Jaipur</option>
                    </select>
                    {form1.formState.errors.city && (
                      <p className="text-xs text-red-500">{form1.formState.errors.city.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Sex</label>
                    <select 
                      {...form1.register("sex")}
                      className="w-full p-3 rounded-lg border bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                    >
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">BMI</label>
                    <input 
                      type="number" 
                      step="0.1"
                      placeholder="e.g. 25.5"
                      {...form1.register("bmi")}
                      className="w-full p-3 rounded-lg border bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Children</label>
                    <input 
                      type="number" 
                      placeholder="e.g. 2"
                      {...form1.register("children")}
                      className="w-full p-3 rounded-lg border bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Smoker</label>
                    <select 
                      {...form1.register("smoker")}
                      className="w-full p-3 rounded-lg border bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                    >
                      <option value="no">No</option>
                      <option value="yes">Yes</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Region</label>
                    <select 
                      {...form1.register("region")}
                      className="w-full p-3 rounded-lg border bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                    >
                      <option value="southwest">Southwest</option>
                      <option value="southeast">Southeast</option>
                      <option value="northwest">Northwest</option>
                      <option value="northeast">Northeast</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Patient Age</label>
                    <input 
                      type="number" 
                      placeholder="e.g. 45"
                      {...form1.register("age")}
                      className="w-full p-3 rounded-lg border bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                    />
                    {form1.formState.errors.age && (
                      <p className="text-xs text-red-500">{form1.formState.errors.age.message}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  <label className="text-sm font-medium text-slate-700">Hospital Type</label>
                  <div className="grid grid-cols-3 gap-4">
                    {["Government", "Private", "Corporate"].map((type) => (
                      <label key={type} className="cursor-pointer">
                        <input 
                          type="radio" 
                          value={type} 
                          {...form1.register("hospital_type")}
                          className="peer sr-only"
                        />
                        <div className="text-center p-3 rounded-lg border peer-checked:bg-primary/5 peer-checked:border-primary peer-checked:text-primary hover:bg-slate-50 transition-all">
                          {type}
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  <label className="text-sm font-medium text-slate-700">Room Preference</label>
                  <div className="grid grid-cols-3 gap-4">
                    {["General Ward", "Semi-Private", "Private Suite"].map((type) => (
                      <label key={type} className="cursor-pointer">
                        <input 
                          type="radio" 
                          value={type} 
                          {...form1.register("room_type")}
                          className="peer sr-only"
                        />
                        <div className="text-center p-3 rounded-lg border peer-checked:bg-primary/5 peer-checked:border-primary peer-checked:text-primary hover:bg-slate-50 transition-all">
                          {type}
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <Button type="submit" isLoading={isLoading} className="w-full md:w-auto">
                    Next Step <ChevronRight className="ml-2 w-4 h-4" />
                  </Button>
                </div>
              </form>
            </WizardStep>
          )}

          {step === 2 && (
            <WizardStep key="step2" title="Insurance Coverage" description="Let's check how much your insurance might cover.">
              <div className="mb-6 p-4 bg-blue-50 rounded-lg text-blue-800 text-sm border border-blue-100">
                <strong>Preliminary Estimate:</strong> Treatment for {formData.condition.replace("_", " ")} in {formData.city} typically averages around <strong>₹{results.prediction?.avg_cost.toLocaleString()}</strong>.
              </div>
              
              <form onSubmit={form2.handleSubmit(handleStep2)} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Total Coverage Amount (₹)</label>
                  <input 
                    type="number" 
                    placeholder="e.g. 500000"
                    {...form2.register("coverage_amount")}
                    className="w-full p-3 rounded-lg border bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                  />
                  {form2.formState.errors.coverage_amount && (
                    <p className="text-xs text-red-500">{form2.formState.errors.coverage_amount.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <label className="text-sm font-medium text-slate-700">Co-pay Percentage (%)</label>
                    <span className="text-sm text-slate-500">{form2.watch("copay_percent")}%</span>
                  </div>
                  <input 
                    type="range" 
                    min="0"
                    max="50"
                    step="5"
                    {...form2.register("copay_percent")}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                  <p className="text-xs text-slate-500">Percentage of the bill you agree to pay out of pocket.</p>
                </div>

                <div className="flex justify-between pt-4">
                  <Button type="button" variant="ghost" onClick={() => setStep(1)} disabled={isLoading}>
                    <ChevronLeft className="mr-2 w-4 h-4" /> Back
                  </Button>
                  <Button type="submit" isLoading={isLoading}>
                    Next Step <ChevronRight className="ml-2 w-4 h-4" />
                  </Button>
                </div>
              </form>
            </WizardStep>
          )}

          {step === 3 && (
            <WizardStep key="step3" title="Financial Health" description="Help us recommend the best payment strategy.">
              <form onSubmit={form3.handleSubmit(handleStep3)} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Monthly Household Income (₹)</label>
                  <input 
                    type="number" 
                    placeholder="e.g. 50000"
                    {...form3.register("monthly_income")}
                    className="w-full p-3 rounded-lg border bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                  />
                  <p className="text-xs text-slate-500">This helps us suggest EMI plans or loans if needed.</p>
                  {form3.formState.errors.monthly_income && (
                    <p className="text-xs text-red-500">{form3.formState.errors.monthly_income.message}</p>
                  )}
                </div>

                <div className="flex justify-between pt-4">
                  <Button type="button" variant="ghost" onClick={() => setStep(2)} disabled={isLoading}>
                    <ChevronLeft className="mr-2 w-4 h-4" /> Back
                  </Button>
                  <Button type="submit" isLoading={isLoading} className="bg-emerald-600 hover:bg-emerald-700 shadow-emerald-900/20">
                    Get My Plan <Check className="ml-2 w-4 h-4" />
                  </Button>
                </div>
              </form>
            </WizardStep>
          )}

          {step === 4 && (
            <div className="max-w-4xl mx-auto">
               <div className="text-center mb-10">
                 <h2 className="text-4xl font-display font-bold text-slate-900 mb-2">Your Personalized Report</h2>
                 <p className="text-slate-500">Based on data for {formData.condition} in {formData.city}</p>
               </div>

               <div className="grid md:grid-cols-2 gap-6 mb-8">
                  {results.prediction && (
                    <CostCard 
                      min={results.prediction.min_cost}
                      avg={results.prediction.avg_cost}
                      max={results.prediction.max_cost}
                    />
                  )}
                  {results.insurance && (
                    <InsuranceCard 
                      coverage={formData.coverage_amount}
                      outOfPocket={results.insurance.out_of_pocket_estimate}
                      explanation={results.insurance.explanation}
                    />
                  )}
                  {results.recommendation && (
                    <RecommendationCard 
                      recommendation={results.recommendation.recommendation}
                      actionPlan={results.recommendation.action_plan}
                    />
                  )}
               </div>

               <div className="flex justify-center gap-4 py-8">
                 <Button variant="outline" onClick={() => window.print()}>Print Report</Button>
                 <Button onClick={() => { setStep(1); setFormData({}); setResults({}); }}>Start New Assessment</Button>
               </div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </Layout>
  );
}
