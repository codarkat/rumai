"use client"

import { ReactNode, useState } from 'react';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { UseFormReturn } from 'react-hook-form';
import { Eye, EyeOff } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FormInputProps {
  form: UseFormReturn<any>;
  name: string;
  label: string;
  placeholder: string;
  type?: string;
  icon?: ReactNode;
}

export function FormInput({
  form,
  name,
  label,
  placeholder,
  type = 'text',
  icon
}: FormInputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel className={form.formState.errors[name] ? "text-red-500 font-medium" : "text-blue-600 font-medium"}>{label}</FormLabel>
          <div className="relative">
            {icon && (
              <div className={cn(
                "absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none",
                form.formState.errors[name] ? "text-red-500" : "text-blue-600"
              )}>
                {icon}
              </div>
            )}
            <FormControl>
              <Input 
                type={isPassword ? (showPassword ? 'text' : 'password') : type} 
                placeholder={placeholder} 
                {...field} 
                className={cn(
                  "h-10 bg-white/50 focus:ring-2 text-medium placeholder:text-gray-400 placeholder:text-sm focus-visible:border-sky-400 focus-visible:ring-sky-400/20 focus-visible:ring-[3px]",
                  form.formState.errors[name] ? "border-red-500 focus:border-red-500 focus:ring-red-500 text-red-500" : "border-sky-300 focus:border-blue-500 focus:ring-sky-400 text-blue-600",
                  icon ? "pl-10" : ""
                )}
              />
            </FormControl>
            {isPassword && (
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-600 hover:text-sky-400 transition-colors"
                aria-label={showPassword ? "Ẩn mật khẩu" : "Hiển thị mật khẩu"}
              >
                {showPassword ? <EyeOff size={18} className={form.formState.errors[name] ? "text-red-500" : "text-blue-600"} /> : <Eye size={18} className={form.formState.errors[name] ? "text-red-500" : "text-blue-600"} />}
              </button>
            )}
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
} 