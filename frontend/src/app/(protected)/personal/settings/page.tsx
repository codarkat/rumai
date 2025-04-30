"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { FormEvent } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Form } from "@/components/ui/form";
import { FormInput } from "@/components/form-fields/FormInput";
import { FormSelect } from "@/components/form-fields/FormSelect";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  User,
  Mail,
  Phone,
  GraduationCap,
  Lock,
  ArrowLeft,
  Upload,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

// Định nghĩa schema validation
const userFormSchema = z.object({
  full_name: z.string().min(2, { message: "Họ tên phải có ít nhất 2 ký tự" }),
  email: z.string().email({ message: "Email không hợp lệ" }),
  phone: z.string().min(10, { message: "Số điện thoại không hợp lệ" }),
  level: z.string(),
});

type UserFormValues = z.infer<typeof userFormSchema>;

export default function SettingsPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [activeTab, setActiveTab] = useState("profile");

  // Khởi tạo form với react-hook-form và zod
  const form = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      full_name: "Nguyễn Văn A",
      email: "nguyenvana@example.com",
      phone: "0912345678",
      level: "Trung cấp",
    },
  });

  const handleSubmit = async (values: UserFormValues) => {
    setIsLoading(true);
    setMessage({ type: "", text: "" });

    try {
      // Giả lập API call để cập nhật thông tin người dùng
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Trong thực tế, sẽ gọi API để cập nhật thông tin
      // const response = await fetch('/api/user/update', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(values)
      // });

      setMessage({
        type: "success",
        text: "Cập nhật thông tin thành công!",
      });
    } catch (error) {
      setMessage({
        type: "error",
        text: "Đã xảy ra lỗi khi cập nhật thông tin.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto max-w-5xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center mb-8">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            className="mr-4 text-blue-600 hover:bg-blue-100/50"
          >
            <ArrowLeft size={20} />
          </Button>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-sky-500 to-blue-400 bg-clip-text text-transparent">
            Cài đặt tài khoản
          </h1>
        </div>

        <Card className="backdrop-blur-lg bg-white/60 border border-sky-100/50">
          <CardHeader className="pb-4">
            <CardTitle className="text-2xl text-blue-700">
              Thông tin cá nhân
            </CardTitle>
            <CardDescription className="text-blue-600/70">
              Quản lý thông tin cá nhân và cài đặt tài khoản của bạn
            </CardDescription>
          </CardHeader>

          <CardContent>
            {message.text && (
              <Alert
                className={`mb-6 ${
                  message.type === "success"
                    ? "bg-green-100 text-green-800 border-green-200"
                    : "bg-red-100 text-red-800 border-red-200"
                }`}
              >
                <AlertDescription>{message.text}</AlertDescription>
              </Alert>
            )}

            <Tabs
              defaultValue="profile"
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid grid-cols-2 mb-8">
                <TabsTrigger
                  value="profile"
                  className="data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700"
                >
                  Hồ sơ
                </TabsTrigger>
                <TabsTrigger
                  value="security"
                  className="data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700"
                >
                  Bảo mật
                </TabsTrigger>
              </TabsList>

              <TabsContent value="profile">
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(handleSubmit)}
                    className="space-y-6"
                  >
                    <div className="flex flex-col md:flex-row gap-8">
                      <div className="md:w-1/3 flex flex-col items-center">
                        <Avatar className="w-40 h-40 border-4 border-white">
                          <AvatarImage src="/default-avatar.png" alt="Avatar" />
                          <AvatarFallback className="bg-gradient-to-r from-blue-600 to-sky-400 text-4xl text-white">
                            {form.getValues("full_name").charAt(0)}
                          </AvatarFallback>
                        </Avatar>

                        <Button
                          type="button"
                          variant="outline"
                          className="mt-4 bg-white/80 border-sky-200 text-blue-600 hover:bg-sky-50"
                        >
                          <Upload size={16} className="mr-2" />
                          Thay đổi ảnh đại diện
                        </Button>
                      </div>

                      <div className="md:w-2/3 space-y-4">
                        <FormInput
                          form={form}
                          name="full_name"
                          label="Họ và tên"
                          placeholder="Nhập họ và tên của bạn"
                          icon={<User size={18} />}
                        />

                        <FormInput
                          form={form}
                          name="email"
                          label="Email"
                          placeholder="Nhập địa chỉ email của bạn"
                          type="email"
                          icon={<Mail size={18} />}
                        />

                        <FormInput
                          form={form}
                          name="phone"
                          label="Số điện thoại"
                          placeholder="Nhập số điện thoại của bạn"
                          icon={<Phone size={18} />}
                        />

                        <FormSelect
                          form={form}
                          name="level"
                          label="Trình độ tiếng Nga"
                          placeholder="Chọn trình độ của bạn"
                          icon={<GraduationCap size={18} />}
                          options={[
                            { value: "Sơ cấp", label: "Sơ cấp" },
                            { value: "Trung cấp", label: "Trung cấp" },
                            { value: "Cao cấp", label: "Cao cấp" },
                          ]}
                        />
                      </div>
                    </div>

                    <div className="flex justify-end space-x-4 pt-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => router.back()}
                        className="bg-white/80 border-gray-200"
                      >
                        Hủy
                      </Button>
                      <Button
                        type="submit"
                        disabled={isLoading}
                        className="bg-gradient-to-r from-blue-600 to-sky-400 text-white hover:opacity-90"
                      >
                        {isLoading ? (
                          <>
                            <svg
                              className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              ></circle>
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              ></path>
                            </svg>
                            Đang xử lý...
                          </>
                        ) : (
                          "Lưu thay đổi"
                        )}
                      </Button>
                    </div>
                  </form>
                </Form>
              </TabsContent>

              <TabsContent value="security">
                <div className="space-y-6">
                  <div className="bg-blue-50/50 p-6 rounded-xl border border-blue-100">
                    <div className="flex items-start">
                      <Lock className="text-blue-600 mr-4 mt-1" size={24} />
                      <div>
                        <h3 className="text-lg font-medium text-blue-700 mb-2">
                          Bảo mật tài khoản
                        </h3>
                        <p className="text-blue-600/70 mb-4">
                          Thay đổi mật khẩu của bạn định kỳ để bảo vệ tài khoản.
                          Mật khẩu mạnh nên bao gồm chữ hoa, chữ thường, số và
                          ký tự đặc biệt.
                        </p>
                        <Button
                          variant="outline"
                          className="bg-white border-blue-200 text-blue-600 hover:bg-blue-50"
                          onClick={() => {
                            // Xử lý thay đổi mật khẩu
                          }}
                        >
                          <Lock size={16} className="mr-2" />
                          Thay đổi mật khẩu
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="bg-amber-50/50 p-6 rounded-xl border border-amber-100">
                    <h3 className="text-lg font-medium text-amber-700 mb-2">
                      Xác thực hai yếu tố
                    </h3>
                    <p className="text-amber-600/70 mb-4">
                      Bảo vệ tài khoản của bạn với lớp bảo mật bổ sung. Khi được
                      bật, bạn sẽ cần mã xác thực bổ sung khi đăng nhập.
                    </p>
                    <Button
                      variant="outline"
                      className="bg-white border-amber-200 text-amber-600 hover:bg-amber-50"
                    >
                      Thiết lập xác thực hai yếu tố
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
