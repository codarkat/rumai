import React from "react";
import { CheckCircle } from "lucide-react";

type LevelDescriptionProps = {
  level: string;
};

export function LevelDescription({ level }: LevelDescriptionProps) {
  switch (level) {
    case "A1":
      return (
        <div className="space-y-3">
          <p className="text-gray-700">
            <span className="font-semibold">A1 (Beginner):</span> Bạn có thể
            hiểu và sử dụng các cụm từ và câu đơn giản, giao tiếp ở mức cơ bản
            nhất.
          </p>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {[
              "Có thể hiểu và trả lời các câu hỏi cơ bản",
              "Biết cách giới thiệu bản thân và người khác",
              "Nắm được khoảng 500-800 từ vựng thông dụng",
            ].map((item, index) => (
              <li
                key={index}
                className="flex items-start gap-2 bg-sky-50 p-3 rounded-md border border-sky-100"
              >
                <CheckCircle className="h-4 w-4 text-sky-500 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700 text-sm">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      );
    case "A2":
      return (
        <div className="space-y-3">
          <p className="text-gray-700">
            <span className="font-semibold">A2 (Elementary):</span> Bạn có thể
            hiểu được các câu và cụm từ thường dùng liên quan đến những chủ đề
            hàng ngày.
          </p>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {[
              "Giao tiếp trong các tình huống đơn giản",
              "Mô tả được các khía cạnh đơn giản về cuộc sống",
              "Nắm được khoảng 1.500 từ vựng thông dụng",
            ].map((item, index) => (
              <li
                key={index}
                className="flex items-start gap-2 bg-sky-50 p-3 rounded-md border border-sky-100"
              >
                <CheckCircle className="h-4 w-4 text-sky-600 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700 text-sm">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      );
    case "B1":
      return (
        <div className="space-y-3">
          <p className="text-gray-700">
            <span className="font-semibold">B1 (Intermediate):</span> Bạn có thể
            hiểu được các ý chính khi gặp ngôn ngữ rõ ràng và tiêu chuẩn.
          </p>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {[
              "Xử lý được hầu hết các tình huống khi ở nơi sử dụng ngôn ngữ đó",
              "Viết văn bản đơn giản về các chủ đề quen thuộc",
              "Nắm được khoảng 2.500 từ vựng thông dụng",
            ].map((item, index) => (
              <li
                key={index}
                className="flex items-start gap-2 bg-blue-50 p-3 rounded-md border border-blue-100"
              >
                <CheckCircle className="h-4 w-4 text-blue-500 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700 text-sm">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      );
    case "B2":
      return (
        <div className="space-y-3">
          <p className="text-gray-700">
            <span className="font-semibold">B2 (Upper Intermediate):</span> Bạn
            có thể hiểu được ý chính của văn bản phức tạp về các chủ đề cụ thể
            và trừu tượng.
          </p>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {[
              "Giao tiếp được với người bản ngữ một cách tự nhiên",
              "Trình bày rõ ràng và chi tiết về nhiều chủ đề",
              "Nắm được khoảng 4.000 từ vựng thông dụng",
            ].map((item, index) => (
              <li
                key={index}
                className="flex items-start gap-2 bg-blue-50 p-3 rounded-md border border-blue-100"
              >
                <CheckCircle className="h-4 w-4 text-blue-600 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700 text-sm">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      );
    case "C1":
      return (
        <div className="space-y-3">
          <p className="text-gray-700">
            <span className="font-semibold">C1 (Advanced):</span> Bạn có thể
            hiểu được nhiều loại văn bản dài và khó, nhận biết được nghĩa ẩn ý.
          </p>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {[
              "Sử dụng ngôn ngữ linh hoạt và hiệu quả cho mục đích xã hội, học thuật và chuyên môn",
              "Tạo ra văn bản rõ ràng, cấu trúc tốt, chi tiết về các chủ đề phức tạp",
              "Nắm được khoảng 8.000 từ vựng thông dụng",
            ].map((item, index) => (
              <li
                key={index}
                className="flex items-start gap-2 bg-blue-50 p-3 rounded-md border border-blue-100"
              >
                <CheckCircle className="h-4 w-4 text-blue-700 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700 text-sm">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      );
    case "C2":
      return (
        <div className="space-y-3">
          <p className="text-gray-700">
            <span className="font-semibold">C2 (Proficiency):</span> Bạn có thể
            hiểu dễ dàng hầu như tất cả những gì nghe và đọc được.
          </p>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {[
              "Tóm tắt thông tin từ nhiều nguồn khác nhau",
              "Tái hiện lập luận một cách mạch lạc",
              "Làm chủ vốn từ vựng phong phú trên 10.000 từ vựng thông dụng",
              "Giao tiếp ở trình độ chuẩn của người bản ngữ",
            ].map((item, index) => (
              <li
                key={index}
                className="flex items-start gap-2 bg-blue-50 p-3 rounded-md border border-blue-100"
              >
                <CheckCircle className="h-4 w-4 text-blue-800 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700 text-sm">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      );
    default:
      return (
        <p className="text-gray-700">
          Không có thông tin chi tiết về trình độ này.
        </p>
      );
  }
}
