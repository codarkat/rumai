import { LoginForm } from '@/components/auth/LoginForm';
import Link from 'next/link';
import { FaUserCircle } from 'react-icons/fa';
import Image from 'next/image';

export default function LoginPage() {
  return (
    <div className="relative z-10 w-full max-w-md">
      <div className="backdrop-blur-xl bg-white/80 p-8 rounded-3xl border border-white/40 shadow-2xl transition-all duration-300 hover:shadow-blue-100/20">
        {/* Decorative elements */}
        <div className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-br from-blue-400 to-sky-500 rounded-full opacity-20 blur-xl"></div>
        <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-gradient-to-tr from-sky-400 to-blue-500 rounded-full opacity-20 blur-xl"></div>
        
        <div className="relative">
          {/* Header */}
          <div className="flex flex-col items-center mb-8">
            <div className="bg-gradient-to-r from-sky-400 to-blue-600 p-4 rounded-full mb-5 shadow-lg shadow-blue-500/30 ring-4 ring-white/50">
              <FaUserCircle className="text-white text-3xl" />
            </div>
            <h1 className="text-3xl font-bold text-center bg-gradient-to-r from-sky-400 to-blue-600 bg-clip-text text-transparent uppercase">
              KHÁM PHÁ NGAY
            </h1>
            <div className="h-1 w-16 bg-gradient-to-r from-sky-400 to-blue-600 rounded-full my-1"></div>
            <p className="text-gray-500 text-sm font-medium">Chìa khóa mở cánh cửa tri thức Nga</p>
          </div>
          
          {/* Form */}
          <div className="relative z-10 px-2">
            <LoginForm />
          </div>
          
          {/* Footer */}
          <div className="text-center mt-8">
            <p className="text-sm text-gray-600">
              Chưa có tài khoản?{' '}
              <Link href="/auth/register" className="text-blue-600 hover:text-sky-400 font-medium transition-colors hover:underline">
                Đăng ký ngay
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 