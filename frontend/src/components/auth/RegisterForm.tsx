"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form } from "@/components/ui/form";
import { authService, RegisterData } from "@/services/auth.service";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { User, UserCircle, Mail, Lock, Contact } from "lucide-react";
import {
  FormInput,
  FormError,
  FormSubmitButton,
} from "@/components/form-fields";

const registerSchema = z
  .object({
    full_name: z.string().min(2, "Tên phải có ít nhất 2 ký tự"),
    username: z
      .string()
      .min(3, "Tên đăng nhập phải có ít nhất 3 ký tự")
      .regex(
        /^[a-z0-9_]+$/,
        "Tên đăng nhập chỉ được chứa chữ thường, số và dấu gạch dưới"
      ),
    email: z.string().email("Email không hợp lệ"),
    password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
    confirmPassword: z.string().min(1, "Vui lòng xác nhận mật khẩu"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmPassword"],
  });

export function RegisterForm() {
  const router = useRouter();
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<RegisterData & { confirmPassword: string }>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      full_name: "",
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: RegisterData) => {
    try {
      setIsLoading(true);
      setError("");
      await authService.register(data);
      router.push("/personal");
    } catch (err) {
      setError("Có lỗi xảy ra khi đăng ký. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormInput
          form={form}
          name="full_name"
          label="Họ tên"
          placeholder="Nguyễn Văn A"
          icon={<User size={18} />}
        />

        <FormInput
          form={form}
          name="username"
          label="Tên đăng nhập"
          placeholder="username"
          icon={<Contact size={18} />}
        />

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
          loadingText="Đang đăng ký..."
          submitText="Đăng ký"
        />
      </form>
    </Form>
  );
}
