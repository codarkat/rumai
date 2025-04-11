import Link from 'next/link';
import { FaArrowLeft } from 'react-icons/fa';

export const metadata = {
  title: 'Sứ mệnh & Tầm nhìn | Học tiếng Nga',
  description: 'Sứ mệnh và tầm nhìn của nền tảng học tiếng Nga trực tuyến hàng đầu Việt Nam',
};

export default function MissionPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <Link 
        href="/about" 
        className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-8 group"
      >
        <FaArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" />
        Quay lại trang giới thiệu
      </Link>

      <div className="bg-white rounded-2xl shadow-md p-8 mb-12">
        <h1 className="text-3xl font-bold text-blue-600 mb-6 border-b border-blue-100 pb-4">
          Sứ mệnh & Tầm nhìn
        </h1>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-blue-600 mb-4">Sứ mệnh của chúng tôi</h2>
          <p className="text-gray-700 mb-4 leading-relaxed">
            Sứ mệnh của chúng tôi là mang đến một nền tảng học tiếng Nga toàn diện, hiệu quả và dễ tiếp cận cho người Việt Nam. 
            Chúng tôi cam kết phá bỏ rào cản ngôn ngữ và văn hóa, tạo điều kiện cho người học khám phá và làm chủ tiếng Nga - 
            một trong những ngôn ngữ quan trọng trên thế giới.
          </p>
          <p className="text-gray-700 mb-4 leading-relaxed">
            Chúng tôi tin rằng việc học ngôn ngữ không chỉ là về từ vựng và ngữ pháp, mà còn là cầu nối văn hóa, 
            mở ra cơ hội học tập, làm việc và giao lưu quốc tế. Thông qua nền tảng của chúng tôi, 
            người học sẽ được trang bị không chỉ kiến thức ngôn ngữ mà còn hiểu biết sâu sắc về văn hóa, 
            lịch sử và con người Nga.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-blue-600 mb-4">Tầm nhìn của chúng tôi</h2>
          <p className="text-gray-700 mb-4 leading-relaxed">
            Chúng tôi hướng đến việc trở thành nền tảng học tiếng Nga hàng đầu tại Việt Nam, 
            được công nhận về chất lượng giảng dạy và hiệu quả học tập. Chúng tôi mong muốn xây dựng 
            một cộng đồng người học tiếng Nga lớn mạnh, nơi mọi người có thể chia sẻ, học hỏi và phát triển cùng nhau.
          </p>
          <p className="text-gray-700 mb-4 leading-relaxed">
            Trong tương lai, chúng tôi sẽ không ngừng đổi mới phương pháp giảng dạy, 
            ứng dụng công nghệ tiên tiến và mở rộng nội dung học tập để đáp ứng nhu cầu ngày càng đa dạng của người học. 
            Chúng tôi cam kết đồng hành cùng người học trong mọi giai đoạn, từ người mới bắt đầu đến trình độ nâng cao, 
            từ học sinh, sinh viên đến người đi làm.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-blue-600 mb-4">Giá trị cốt lõi</h2>
          <ul className="list-disc pl-6 space-y-3 text-gray-700">
            <li className="leading-relaxed">
              <span className="font-semibold">Chất lượng:</span> Cam kết mang đến nội dung học tập chất lượng cao, 
              được biên soạn bởi các chuyên gia ngôn ngữ và giảng viên giàu kinh nghiệm.
            </li>
            <li className="leading-relaxed">
              <span className="font-semibold">Sáng tạo:</span> Không ngừng đổi mới phương pháp giảng dạy, 
              tạo ra trải nghiệm học tập thú vị và hiệu quả.
            </li>
            <li className="leading-relaxed">
              <span className="font-semibold">Cá nhân hóa:</span> Tôn trọng sự khác biệt trong phong cách học tập của mỗi người, 
              cung cấp lộ trình học tập phù hợp với từng cá nhân.
            </li>
            <li className="leading-relaxed">
              <span className="font-semibold">Cộng đồng:</span> Xây dựng một cộng đồng học tập hỗ trợ lẫn nhau, 
              nơi người học có thể kết nối, chia sẻ và phát triển.
            </li>
            <li className="leading-relaxed">
              <span className="font-semibold">Tiếp cận:</span> Cam kết làm cho việc học tiếng Nga trở nên dễ tiếp cận 
              với mọi đối tượng, không phân biệt độ tuổi, trình độ hay điều kiện kinh tế.
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
} 