import { motion } from "framer-motion";
import { ReactNode } from "react";

interface WizardStepProps {
  children: ReactNode;
  title: string;
  description: string;
}

export function WizardStep({ children, title, description }: WizardStepProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="w-full max-w-2xl mx-auto"
    >
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold font-display text-slate-900 mb-2">{title}</h2>
        <p className="text-slate-500 text-lg">{description}</p>
      </div>
      <div className="bg-white rounded-2xl p-8 shadow-xl shadow-slate-200/50 border border-slate-100">
        {children}
      </div>
    </motion.div>
  );
}
