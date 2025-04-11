"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form } from "@/components/ui/form";
import { useState } from "react";
import { signIn as authSignIn } from "next-auth/react";
import { Mail, Lock } from "lucide-react";
import {
  FormInput,
  FormError,
  FormSubmitButton,
} from "@/components/form-fields";
import Link from "next/link";
import { authService } from "@/services/auth.service";

const loginSchema = z.object({
  email: z.string().email("Email không hợp lệ"),
  password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function LoginForm() {
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("Đang đăng nhập...");

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setIsLoading(true);
      setError("");
      const response = await authService.login({
        email: data.email as string,
        password: data.password as string,
      });
      setLoadingText("Đang thiết lập dữ liệu...");

      const accessToken = response.access_token || response.token;
      const refreshToken = response.refresh_token;

      if (accessToken) {
        authSignIn("credentials", {
          email: data.email,
          password: data.password,
          token: accessToken,
          refreshToken: refreshToken,
          redirect: true,
          callbackUrl: "/personal",
        });
      } else {
        setError("Không thể đăng nhập. Vui lòng thử lại sau.");
        setIsLoading(false);
      }
    } catch (err) {
      setError(
        "Mật khẩu hoặc mật khẩu không chính xác. Vui lòng kiểm tra lại."
      );
      setIsLoading(false);
    }
  };

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

        <FormInput
          form={form}
          name="password"
          label="Mật khẩu"
          placeholder="********"
          type="password"
          icon={<Lock size={18} />}
        />

        <div className="flex justify-end">
          <Link
            href="/auth/forgot-password"
            className="text-sm text-blue-600 hover:text-sky-400 transition-colors hover:underline"
          >
            Quên mật khẩu?
          </Link>
        </div>

        <FormError error={error} />

        <FormSubmitButton
          isLoading={isLoading}
          loadingText={loadingText}
          submitText="Đăng nhập"
        />
      </form>
    </Form>
  );
}
