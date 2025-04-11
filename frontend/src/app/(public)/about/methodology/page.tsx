import Link from 'next/link';
import { FaArrowLeft, FaBrain, FaHeadphones, FaComments, FaPen, FaBook, FaLaptop } from 'react-icons/fa';

export const metadata = {
  title: 'Phương pháp giảng dạy | Học tiếng Nga',
  description: 'Khám phá phương pháp giảng dạy độc đáo và hiệu quả của chúng tôi',
};

export default function MethodologyPage() {
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
          Phương pháp giảng dạy
        </h1>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-blue-600 mb-4">Triết lý giảng dạy của chúng tôi</h2>
          <p className="text-gray-700 mb-4 leading-relaxed">
            Chúng tôi tin rằng việc học ngôn ngữ hiệu quả nhất khi được thực hiện một cách toàn diện, 
            kết hợp giữa lý thuyết và thực hành, giữa học tập có cấu trúc và trải nghiệm thực tế. 
            Phương pháp giảng dạy của chúng tôi được thiết kế dựa trên các nghiên cứu khoa học về 
            cách não bộ tiếp thu ngôn ngữ mới và các phương pháp giảng dạy tiên tiến trên thế giới.
          </p>
          <p className="text-gray-700 mb-4 leading-relaxed">
            Chúng tôi áp dụng cách tiếp cận cá nhân hóa, tôn trọng phong cách học tập và tốc độ tiến bộ 
            của từng học viên. Mục tiêu của chúng tôi không chỉ là giúp học viên nắm vững ngữ pháp và từ vựng, 
            mà còn phát triển khả năng sử dụng tiếng Nga một cách tự nhiên và tự tin trong các tình huống thực tế.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-blue-600 mb-4">Các phương pháp chính</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div className="bg-blue-50 p-5 rounded-xl border border-blue-100">
              <div className="flex items-center mb-3">
                <div className="bg-blue-100 p-2 rounded-lg mr-3">
                  <FaBrain className="text-blue-600 text-xl" />
                </div>
                <h3 className="text-lg font-semibold text-blue-600">Phương pháp ghi nhớ hiệu quả</h3>
              </div>
              <p className="text-gray-700">
                Áp dụng kỹ thuật lặp lại ngắt quãng (spaced repetition) và liên kết từ vựng với hình ảnh, 
                âm thanh để tăng cường khả năng ghi nhớ dài hạn.
              </p>
            </div>
            
            <div className="bg-blue-50 p-5 rounded-xl border border-blue-100">
              <div className="flex items-center mb-3">
                <div className="bg-blue-100 p-2 rounded-lg mr-3">
                  <FaHeadphones className="text-blue-600 text-xl" />
                </div>
                <h3 className="text-lg font-semibold text-blue-600">Phương pháp nghe - nói tự nhiên</h3>
              </div>
              <p className="text-gray-700">
                Tập trung vào việc nghe và bắt chước cách phát âm của người bản xứ, 
                giúp học viên phát triển khả năng nghe và nói một cách tự nhiên.
              </p>
            </div>
            
            <div className="bg-blue-50 p-5 rounded-xl border border-blue-100">
              <div className="flex items-center mb-3">
                <div className="bg-blue-100 p-2 rounded-lg mr-3">
                  <FaComments className="text-blue-600 text-xl" />
                </div>
                <h3 className="text-lg font-semibold text-blue-600">Học qua tình huống thực tế</h3>
              </div>
              <p className="text-gray-700">
                Xây dựng các tình huống giao tiếp thực tế, giúp học viên áp dụng kiến thức đã học 
                vào các tình huống hàng ngày, tăng tính thực tiễn.
              </p>
            </div>
            
            <div className="bg-blue-50 p-5 rounded-xl border border-blue-100">
              <div className="flex items-center mb-3">
                <div className="bg-blue-100 p-2 rounded-lg mr-3">
                  <FaPen className="text-blue-600 text-xl" />
                </div>
                <h3 className="text-lg font-semibold text-blue-600">Phương pháp viết tích cực</h3>
              </div>
              <p className="text-gray-700">
                Khuyến khích học viên viết thường xuyên, từ những câu đơn giản đến các bài luận phức tạp, 
                giúp củng cố ngữ pháp và từ vựng.
              </p>
            </div>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-blue-600 mb-4">Lộ trình học tập</h2>
          <p className="text-gray-700 mb-6 leading-relaxed">
            Chúng tôi thiết kế lộ trình học tập khoa học, từ cơ bản đến nâng cao, giúp học viên 
            tiến bộ một cách vững chắc. Mỗi cấp độ đều có mục tiêu rõ ràng và được đánh giá thường xuyên 
            để đảm bảo học viên đạt được kết quả tốt nhất.
          </p>
          
          <div className="space-y-4">
            <div className="bg-blue-50 p-5 rounded-xl border border-blue-100">
              <h3 className="text-lg font-semibold text-blue-600 mb-2">Cấp độ A1-A2: Nền tảng</h3>
              <p className="text-gray-700">
                Xây dựng nền tảng vững chắc với ngữ pháp cơ bản, từ vựng thông dụng và các tình huống 
                giao tiếp hàng ngày. Học viên có thể tự giới thiệu, hỏi đường, đặt món ăn, và tham gia 
                các cuộc hội thoại đơn giản.
              </p>
            </div>
            
            <div className="bg-blue-50 p-5 rounded-xl border border-blue-100">
              <h3 className="text-lg font-semibold text-blue-600 mb-2">Cấp độ B1-B2: Trung cấp</h3>
              <p className="text-gray-700">
                Mở rộng vốn từ vựng, nắm vững các cấu trúc ngữ pháp phức tạp hơn, và phát triển khả năng 
                đọc hiểu, viết và giao tiếp trong nhiều tình huống khác nhau. Học viên có thể thảo luận 
                về các chủ đề xã hội, văn hóa, và chuyên ngành cơ bản.
              </p>
            </div>
            
            <div className="bg-blue-50 p-5 rounded-xl border border-blue-100">
              <h3 className="text-lg font-semibold text-blue-600 mb-2">Cấp độ C1-C2: Nâng cao</h3>
              <p className="text-gray-700">
                Hoàn thiện kỹ năng ngôn ngữ ở mức độ gần với người bản xứ, có thể hiểu và sử dụng tiếng Nga 
                trong các tình huống phức tạp, chuyên ngành, và học thuật. Học viên có thể đọc văn học, 
                tham gia các cuộc thảo luận chuyên sâu, và viết các bài luận phức tạp.
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-blue-600 mb-4">Công nghệ trong giảng dạy</h2>
          <p className="text-gray-700 mb-6 leading-relaxed">
            Chúng tôi tích hợp công nghệ hiện đại vào quá trình giảng dạy để tăng tính tương tác 
            và hiệu quả học tập. Nền tảng học trực tuyến của chúng tôi cung cấp các công cụ học tập 
            đa dạng, từ bài tập tương tác, video, đến các trò chơi học tập và diễn đàn thảo luận.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-blue-50 p-5 rounded-xl border border-blue-100">
              <div className="flex items-center mb-3">
                <div className="bg-blue-100 p-2 rounded-lg mr-3">
                  <FaLaptop className="text-blue-600 text-xl" />
                </div>
                <h3 className="text-lg font-semibold text-blue-600">Học trực tuyến linh hoạt</h3>
              </div>
              <p className="text-gray-700">
                Nền tảng học trực tuyến cho phép học viên học mọi lúc, mọi nơi, trên nhiều thiết bị khác nhau, 
                giúp việc học trở nên linh hoạt và phù hợp với lịch trình cá nhân.
              </p>
            </div>
            
            <div className="bg-blue-50 p-5 rounded-xl border border-blue-100">
              <div className="flex items-center mb-3">
                <div className="bg-blue-100 p-2 rounded-lg mr-3">
                  <FaBook className="text-blue-600 text-xl" />
                </div>
                <h3 className="text-lg font-semibold text-blue-600">Tài liệu đa phương tiện</h3>
              </div>
              <p className="text-gray-700">
                Kết hợp văn bản, hình ảnh, âm thanh và video để tạo ra trải nghiệm học tập đa giác quan, 
                giúp học viên tiếp thu và ghi nhớ kiến thức hiệu quả hơn.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
} 