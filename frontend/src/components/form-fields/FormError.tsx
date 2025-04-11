"use client"

import { AlertCircle } from 'lucide-react';

interface FormErrorProps {
  error?: string;
}

export function FormError({ error }: FormErrorProps) {
  if (!error) return null;
  
  return (
    <div className="text-red-500 text-sm flex items-center gap-2 p-2 bg-red-50/80 rounded-md border border-red-100 shadow-sm">
      <AlertCircle size={16} className="text-red-500" />
      <span className="font-medium">{error}</span>
    </div>
  );
} 