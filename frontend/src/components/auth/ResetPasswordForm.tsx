"use client"

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form } from '@/components/ui/form';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Lock } from 'lucide-react';
import { FormInput, FormError, FormSubmitButton } from '@/components/form-fields';
import { authService, ResetPasswordData } from '@/services/auth.service';
import { toast } from 'sonner';

const resetPasswordSchema = z.object({
  password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
  confirmPassword: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Mật khẩu không khớp",
  path: ["confirmPassword"],
});

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

export function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [token, setToken] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    const tokenParam = searchParams.get('token');
    if (!tokenParam) {
      setError('Token không hợp lệ hoặc đã hết hạn');
      return;
    }
    setToken(tokenParam);
  }, [searchParams]);

  const form = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: ResetPasswordFormData) => {
    if (!token) {
      setError('Token không hợp lệ hoặc đã hết hạn');
      return;
    }

    try {
      setIsLoading(true);
      setError('');

      const result = await authService.resetPassword({
        token,
        password: data.password,
      });

      setIsSuccess(true);
      toast.success('Mật khẩu đã được đặt lại thành công!');
    } catch (err: any) {
      console.error('Lỗi không xác định:', err);
      setError(err.response?.data?.message || 'Có lỗi xảy ra khi đặt lại mật khẩu. Vui lòng thử lại sau.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!token && !isSuccess) {
    return (
      <div className="text-center p-4 bg-red-50 rounded-lg border border-red-200">
        <h3 className="text-lg font-medium text-red-800 mb-2">Token không hợp lệ</h3>
        <p className="text-red-600 mb-4">
          Liên kết đặt lại mật khẩu không hợp lệ hoặc đã hết hạn.
          Vui lòng yêu cầu liên kết mới.
        </p>
        <button
          onClick={() => router.push('/auth/forgot-password')}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Yêu cầu liên kết mới
        </button>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
        <h3 className="text-lg font-medium text-green-800 mb-2">Mật khẩu đã được đặt lại!</h3>
        <p className="text-green-600 mb-4">
          Mật khẩu của bạn đã được đặt lại thành công.
          Bây giờ bạn có thể đăng nhập bằng mật khẩu mới.
        </p>
        <button
          onClick={() => router.push('/auth/login')}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Đăng nhập
        </button>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormInput
          form={form}
          name="password"
          label="Mật khẩu mới"
          placeholder="********"
          type="password"
          icon={<Lock size={18} />}
        />
        
        <FormInput
          form={form}
          name="confirmPassword"
          label="Xác nhận mật khẩu"
          placeholder="********"
          type="password"
          icon={<Lock size={18} />}
        />
        
        <FormError error={error} />
        
        <FormSubmitButton
          isLoading={isLoading}
          loadingText="Đang đặt lại mật khẩu..."
          submitText="Đặt lại mật khẩu"
        />
      </form>
    </Form>
  );
} 