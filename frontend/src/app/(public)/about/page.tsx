import Link from 'next/link';
import { FaInfoCircle, FaUsers, FaBook, FaQuestionCircle } from 'react-icons/fa';

export const metadata = {
  title: 'Giới thiệu | Học tiếng Nga',
  description: 'Thông tin về nền tảng học tiếng Nga trực tuyến hàng đầu Việt Nam',
};

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-blue-600 mb-4">Giới thiệu về chúng tôi</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Nền tảng học tiếng Nga trực tuyến hàng đầu Việt Nam, giúp bạn chinh phục ngôn ngữ Nga một cách hiệu quả và thú vị.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        <Link 
          href="/about/mission" 
          className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-6 border border-blue-100 hover:border-blue-200"
        >
          <div className="flex items-center mb-4">
            <div className="bg-blue-100 p-3 rounded-full mr-4">
              <FaInfoCircle className="text-blue-600 text-xl" />
            </div>
            <h2 className="text-2xl font-semibold text-blue-600">Sứ mệnh & Tầm nhìn</h2>
          </div>
          <p className="text-gray-600">
            Tìm hiểu về sứ mệnh và tầm nhìn của chúng tôi trong việc phát triển giáo dục tiếng Nga tại Việt Nam.
          </p>
        </Link>

        <Link 
          href="/about/team" 
          className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-6 border border-blue-100 hover:border-blue-200"
        >
          <div className="flex items-center mb-4">
            <div className="bg-blue-100 p-3 rounded-full mr-4">
              <FaUsers className="text-blue-600 text-xl" />
            </div>
            <h2 className="text-2xl font-semibold text-blue-600">Đội ngũ giảng viên</h2>
          </div>
          <p className="text-gray-600">
            Gặp gỡ đội ngũ giảng viên giàu kinh nghiệm và đam mê của chúng tôi, những người sẽ đồng hành cùng bạn.
          </p>
        </Link>

        <Link 
          href="/about/methodology" 
          className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-6 border border-blue-100 hover:border-blue-200"
        >
          <div className="flex items-center mb-4">
            <div className="bg-blue-100 p-3 rounded-full mr-4">
              <FaBook className="text-blue-600 text-xl" />
            </div>
            <h2 className="text-2xl font-semibold text-blue-600">Phương pháp giảng dạy</h2>
          </div>
          <p className="text-gray-600">
            Khám phá phương pháp giảng dạy độc đáo và hiệu quả giúp bạn tiến bộ nhanh chóng.
          </p>
        </Link>

        <Link 
          href="/about/faq" 
          className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-6 border border-blue-100 hover:border-blue-200"
        >
          <div className="flex items-center mb-4">
            <div className="bg-blue-100 p-3 rounded-full mr-4">
              <FaQuestionCircle className="text-blue-600 text-xl" />
            </div>
            <h2 className="text-2xl font-semibold text-blue-600">Câu hỏi thường gặp</h2>
          </div>
          <p className="text-gray-600">
            Tìm câu trả lời cho những câu hỏi thường gặp về việc học tiếng Nga và nền tảng của chúng tôi.
          </p>
        </Link>
      </div>

      <div className="bg-blue-50 rounded-2xl p-8 border border-blue-100">
        <h2 className="text-2xl font-bold text-blue-600 mb-4">Liên hệ với chúng tôi</h2>
        <p className="text-gray-600 mb-6">
          Bạn có câu hỏi hoặc cần hỗ trợ? Đừng ngần ngại liên hệ với đội ngũ của chúng tôi.
        </p>
        <Link 
          href="/contact" 
          className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          Liên hệ ngay
        </Link>
      </div>
    </div>
  );
} 