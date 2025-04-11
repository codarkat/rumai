"use client"

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form } from '@/components/ui/form';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mail } from 'lucide-react';
import { FormInput, FormError, FormSubmitButton } from '@/components/form-fields';
import { authService, ForgotPasswordData } from '@/services/auth.service';
import { toast } from 'sonner';

const forgotPasswordSchema = z.object({
  email: z.string().email('Email không hợp lệ'),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export function ForgotPasswordForm() {
  const router = useRouter();
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const form = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    try {
      setIsLoading(true);
      setError('');

      const result = await authService.forgotPassword({
        email: data.email,
      });

      setIsSuccess(true);
      toast.success('Yêu cầu đặt lại mật khẩu đã được gửi. Vui lòng kiểm tra email của bạn.');
    } catch (err: any) {
      console.error('Lỗi không xác định:', err);
      setError(err.response?.data?.message || 'Có lỗi xảy ra khi gửi yêu cầu. Vui lòng thử lại sau.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
        <h3 className="text-lg font-medium text-green-800 mb-2">Yêu cầu đã được gửi!</h3>
        <p className="text-green-600 mb-4">
          Chúng tôi đã gửi email hướng dẫn đặt lại mật khẩu đến địa chỉ email của bạn.
          Vui lòng kiểm tra hộp thư đến (và thư mục spam) để tiếp tục.
        </p>
        <button
          onClick={() => router.push('/auth/login')}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Quay lại đăng nhập
        </button>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormInput
          form={form}
          name="email"
          label="Email"
          placeholder="example@email.com"
          icon={<Mail size={18} />}
        />
        
        <FormError error={error} />
        
        <FormSubmitButton
          isLoading={isLoading}
          loadingText="Đang gửi yêu cầu..."
          submitText="Gửi yêu cầu đặt lại mật khẩu"
        />
      </form>
    </Form>
  );
} 