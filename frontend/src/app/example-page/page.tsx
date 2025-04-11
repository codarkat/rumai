"use client";

import { MainLayout } from "@/components/layout/MainLayout";

export default function ExamplePage() {
  return (
    <MainLayout>
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6 text-gray-800">Trang Ví Dụ</h1>

          <div className="bg-white rounded-xl shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">
              Ví dụ về MainLayout
            </h2>
            <p className="text-gray-600 mb-4">
              Đây là một trang ví dụ sử dụng MainLayout. Layout này bao gồm
              Navbar ở phía trên và Footer ở phía dưới.
            </p>
            <p className="text-gray-600 mb-4">
              MainLayout tự động điều chỉnh padding và styling dựa vào việc
              trang hiện tại có phải là trang chủ hay không.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-sky-50 rounded-xl p-6 border border-sky-100">
              <h3 className="text-lg font-semibold mb-2 text-sky-700">
                Tính năng 1
              </h3>
              <p className="text-gray-600">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla
                ac purus at leo malesuada varius.
              </p>
            </div>
            <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
              <h3 className="text-lg font-semibold mb-2 text-blue-700">
                Tính năng 2
              </h3>
              <p className="text-gray-600">
                Donec eu libero sit amet quam egestas semper. Aenean ultricies
                mi vitae est.
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-sky-100 to-blue-100 rounded-xl p-6 text-center mb-8">
            <h2 className="text-xl font-semibold mb-2 text-gray-800">
              Sử dụng MainLayout rất đơn giản!
            </h2>
            <p className="text-gray-700">
              Chỉ cần import MainLayout và bọc nội dung trang trong nó.
            </p>
            <div className="mt-4 bg-white/50 p-3 rounded-lg text-left">
              <code className="text-sm text-gray-800">
                {'import { MainLayout } from "@/components/layout/MainLayout";'}
                <br />
                <br />
                {"export default function YourPage() {"}
                <br />
                {"  return ("}
                <br />
                {"    <MainLayout>"}
                <br />
                {"      <div>Nội dung trang của bạn</div>"}
                <br />
                {"    </MainLayout>"}
                <br />
                {"  );"}
                <br />
                {"}"}
                <br />
              </code>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
