"use client"

import { ReactNode } from 'react';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UseFormReturn } from 'react-hook-form';
import { cn } from '@/lib/utils';

interface Option {
  value: string;
  label: string;
}

interface FormSelectProps {
  form: UseFormReturn<any>;
  name: string;
  label: string;
  placeholder: string;
  options: Option[];
  icon?: ReactNode;
}

export function FormSelect({
  form,
  name,
  label,
  placeholder,
  options,
  icon
}: FormSelectProps) {
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
                "absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none z-10",
                form.formState.errors[name] ? "text-red-500" : "text-blue-600"
              )}>
                {icon}
              </div>
            )}
            <FormControl>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
              >
                <SelectTrigger 
                  className={cn(
                    "h-10 bg-white/50 focus:ring-2 text-medium placeholder:text-gray-400 placeholder:text-sm focus-visible:border-sky-400 focus-visible:ring-sky-400/20 focus-visible:ring-[3px]",
                    form.formState.errors[name] ? "border-red-500 focus:border-red-500 focus:ring-red-500 text-red-500" : "border-sky-300 focus:border-blue-500 focus:ring-sky-400 text-blue-600",
                    icon ? "pl-10" : ""
                  )}
                >
                  <SelectValue placeholder={placeholder} />
                </SelectTrigger>
                <SelectContent>
                  {options.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormControl>
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
} 