"use client"

import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface FormSubmitButtonProps {
  isLoading: boolean;
  loadingText: string;
  submitText: string;
}

export function FormSubmitButton({ 
  isLoading, 
  loadingText, 
  submitText 
}: FormSubmitButtonProps) {
  return (
    <Button 
      type="submit" 
      className="w-full bg-gradient-to-r from-sky-400 to-blue-600 hover:bg-[length:200%_auto] hover:bg-[position:right_center] transition-all duration-500 shadow-md hover:shadow-blue-500/20" 
      disabled={isLoading}
    >
      {isLoading ? (
        <div className="flex items-center justify-center gap-2">
          <Loader2 size={18}  className="animate-spin" />
          <span>{loadingText}</span>
        </div>
      ) : (
        submitText
      )}
    </Button>
  );
} 