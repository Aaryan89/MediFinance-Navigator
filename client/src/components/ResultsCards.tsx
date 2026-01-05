import { motion } from "framer-motion";
import { 
  DollarSign, 
  ShieldCheck, 
  Lightbulb, 
  TrendingUp, 
  AlertCircle 
} from "lucide-react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  Cell 
} from "recharts";

interface CostCardProps {
  min: number;
  avg: number;
  max: number;
}

export function CostCard({ min, avg, max }: CostCardProps) {
  const data = [
    { name: "Min", cost: min },
    { name: "Avg", cost: avg },
    { name: "Max", cost: max },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100 h-full flex flex-col"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-blue-100 p-2.5 rounded-lg">
          <TrendingUp className="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <h3 className="font-bold text-slate-900">Estimated Cost</h3>
          <p className="text-sm text-slate-500">Based on condition & facility</p>
        </div>
      </div>
      
      <div className="flex-1 w-full min-h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <XAxis dataKey="name" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={(val) => `₹${val/1000}k`} />
            <Tooltip 
              cursor={{ fill: 'transparent' }}
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              formatter={(val: number) => [`₹${val.toLocaleString()}`, 'Cost']}
            />
            <Bar dataKey="cost" radius={[6, 6, 0, 0]} barSize={40}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={index === 1 ? '#0e7490' : '#cbd5e1'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 pt-4 border-t flex justify-between items-center text-sm">
        <span className="text-slate-500">Average Estimate</span>
        <span className="font-bold text-2xl text-primary">₹{avg.toLocaleString()}</span>
      </div>
    </motion.div>
  );
}

interface InsuranceCardProps {
  coverage: number;
  outOfPocket: number;
  explanation: string;
}

export function InsuranceCard({ coverage, outOfPocket, explanation }: InsuranceCardProps) {
  const isCovered = outOfPocket <= 0;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100 h-full"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="bg-emerald-100 p-2.5 rounded-lg">
          <ShieldCheck className="w-5 h-5 text-emerald-600" />
        </div>
        <div>
          <h3 className="font-bold text-slate-900">Insurance Coverage</h3>
          <p className="text-sm text-slate-500">Your financial protection</p>
        </div>
      </div>

      <div className="space-y-6">
        <div className="p-4 bg-slate-50 rounded-xl">
          <p className="text-sm text-slate-600 leading-relaxed">{explanation}</p>
        </div>

        <div className="flex justify-between items-end">
          <div>
            <p className="text-sm text-slate-500 mb-1">Your coverage limit</p>
            <p className="font-semibold text-lg text-slate-700">₹{coverage.toLocaleString()}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-slate-500 mb-1">Est. Out of Pocket</p>
            <p className={`font-bold text-2xl ${isCovered ? 'text-emerald-600' : 'text-orange-500'}`}>
              ₹{outOfPocket > 0 ? outOfPocket.toLocaleString() : 0}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

interface RecommendationCardProps {
  recommendation: string;
  actionPlan: string[];
}

export function RecommendationCard({ recommendation, actionPlan }: RecommendationCardProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="bg-gradient-to-br from-primary to-primary/80 rounded-2xl p-6 shadow-xl text-white col-span-1 md:col-span-2"
    >
      <div className="flex items-start gap-4">
        <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
          <Lightbulb className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-xl mb-2">Our Recommendation</h3>
          <p className="text-white/90 text-lg leading-relaxed mb-6 font-medium">
            {recommendation}
          </p>

          <div className="bg-white/10 rounded-xl p-6 backdrop-blur-sm border border-white/10">
            <h4 className="font-semibold mb-4 flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              Suggested Action Plan
            </h4>
            <div className="grid md:grid-cols-3 gap-4">
              {actionPlan.map((action, i) => (
                <div key={i} className="bg-white/10 rounded-lg p-3 text-sm border border-white/5">
                  <span className="opacity-60 text-xs uppercase tracking-wider block mb-1">Step {i + 1}</span>
                  {action}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
