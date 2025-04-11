"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DictionaryRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.push("/dictionary/vi-ru");
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-sky-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600">Đang chuyển hướng đến từ điển...</p>
      </div>
    </div>
  );
}
