import Link from 'next/link';
import { FaArrowLeft, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

export const metadata = {
  title: 'Câu hỏi thường gặp | Học tiếng Nga',
  description: 'Tìm câu trả lời cho những câu hỏi thường gặp về việc học tiếng Nga và nền tảng của chúng tôi',
};

export default function FAQPage() {
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
          Câu hỏi thường gặp
        </h1>

        <p className="text-gray-700 mb-8 leading-relaxed">
          Dưới đây là những câu hỏi thường gặp về việc học tiếng Nga và nền tảng của chúng tôi. 
          Nếu bạn không tìm thấy câu trả lời cho câu hỏi của mình, vui lòng liên hệ với chúng tôi.
        </p>

        <Accordion type="single" collapsible className="space-y-4">
          <AccordionItem value="item-1" className="border border-blue-100 rounded-xl overflow-hidden">
            <AccordionTrigger className="px-6 py-4 hover:bg-blue-50 text-left font-medium text-blue-600">
              Tôi chưa biết gì về tiếng Nga, tôi có thể bắt đầu học được không?
            </AccordionTrigger>
            <AccordionContent className="px-6 py-4 bg-blue-50 text-gray-700">
              Hoàn toàn có thể! Nền tảng của chúng tôi được thiết kế cho cả người mới bắt đầu. 
              Chúng tôi có các khóa học từ cơ bản nhất, giúp bạn làm quen với bảng chữ cái Cyrillic, 
              phát âm cơ bản và các cấu trúc câu đơn giản. Bạn sẽ được hướng dẫn từng bước một, 
              với tốc độ phù hợp với khả năng tiếp thu của mình.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-2" className="border border-blue-100 rounded-xl overflow-hidden">
            <AccordionTrigger className="px-6 py-4 hover:bg-blue-50 text-left font-medium text-blue-600">
              Mất bao lâu để có thể giao tiếp cơ bản bằng tiếng Nga?
            </AccordionTrigger>
            <AccordionContent className="px-6 py-4 bg-blue-50 text-gray-700">
              Thời gian để đạt được khả năng giao tiếp cơ bản phụ thuộc vào nhiều yếu tố như thời gian học mỗi ngày, 
              phương pháp học và khả năng tiếp thu ngôn ngữ của mỗi người. Tuy nhiên, với việc học đều đặn 
              khoảng 30-60 phút mỗi ngày, hầu hết học viên có thể giao tiếp cơ bản sau khoảng 3-6 tháng. 
              Điều quan trọng là sự kiên trì và thực hành thường xuyên.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-3" className="border border-blue-100 rounded-xl overflow-hidden">
            <AccordionTrigger className="px-6 py-4 hover:bg-blue-50 text-left font-medium text-blue-600">
              Tiếng Nga có khó học không?
            </AccordionTrigger>
            <AccordionContent className="px-6 py-4 bg-blue-50 text-gray-700">
              Tiếng Nga thường được coi là một ngôn ngữ có độ khó trung bình đối với người Việt. 
              Một số thách thức bao gồm bảng chữ cái Cyrillic, hệ thống ngữ pháp phức tạp với các 
              biến thể của danh từ, tính từ và động từ. Tuy nhiên, với phương pháp học đúng đắn và 
              sự kiên trì, bất kỳ ai cũng có thể học được tiếng Nga. Nền tảng của chúng tôi được thiết kế 
              để đơn giản hóa các khái niệm phức tạp và giúp bạn tiến bộ từng bước.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-4" className="border border-blue-100 rounded-xl overflow-hidden">
            <AccordionTrigger className="px-6 py-4 hover:bg-blue-50 text-left font-medium text-blue-600">
              Tôi có thể học tiếng Nga trên điện thoại di động không?
            </AccordionTrigger>
            <AccordionContent className="px-6 py-4 bg-blue-50 text-gray-700">
              Có, nền tảng của chúng tôi được tối ưu hóa cho cả máy tính và thiết bị di động. 
              Bạn có thể học tiếng Nga mọi lúc, mọi nơi thông qua ứng dụng di động của chúng tôi, 
              có sẵn trên cả iOS và Android. Ứng dụng cung cấp đầy đủ các tính năng như phiên bản web, 
              bao gồm bài học, bài tập, và theo dõi tiến độ.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-5" className="border border-blue-100 rounded-xl overflow-hidden">
            <AccordionTrigger className="px-6 py-4 hover:bg-blue-50 text-left font-medium text-blue-600">
              Có giảng viên hỗ trợ trong quá trình học không?
            </AccordionTrigger>
            <AccordionContent className="px-6 py-4 bg-blue-50 text-gray-700">
              Có, chúng tôi cung cấp hỗ trợ từ giảng viên trong các gói học cao cấp. Bạn có thể đặt lịch 
              các buổi học 1-1 với giảng viên, tham gia các lớp học nhóm trực tuyến, hoặc đặt câu hỏi 
              thông qua diễn đàn và nhận phản hồi từ đội ngũ giảng viên của chúng tôi. Ngoài ra, 
              chúng tôi cũng có cộng đồng học viên năng động, nơi bạn có thể trao đổi và học hỏi từ nhau.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-6" className="border border-blue-100 rounded-xl overflow-hidden">
            <AccordionTrigger className="px-6 py-4 hover:bg-blue-50 text-left font-medium text-blue-600">
              Tôi có thể nhận được chứng chỉ sau khi hoàn thành khóa học không?
            </AccordionTrigger>
            <AccordionContent className="px-6 py-4 bg-blue-50 text-gray-700">
              Có, chúng tôi cấp chứng chỉ hoàn thành cho mỗi cấp độ học. Ngoài ra, chúng tôi cũng 
              cung cấp các khóa học chuẩn bị cho các kỳ thi chứng chỉ quốc tế như TORFL (Test of Russian 
              as a Foreign Language). Các chứng chỉ của chúng tôi được nhiều tổ chức giáo dục và 
              doanh nghiệp công nhận.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-7" className="border border-blue-100 rounded-xl overflow-hidden">
            <AccordionTrigger className="px-6 py-4 hover:bg-blue-50 text-left font-medium text-blue-600">
              Học phí của các khóa học là bao nhiêu?
            </AccordionTrigger>
            <AccordionContent className="px-6 py-4 bg-blue-50 text-gray-700">
              Chúng tôi cung cấp nhiều gói học với mức giá khác nhau, phù hợp với nhu cầu và ngân sách 
              của từng học viên. Gói cơ bản bắt đầu từ 500.000 VNĐ/tháng, gói tiêu chuẩn từ 1.000.000 VNĐ/tháng, 
              và gói cao cấp từ 2.000.000 VNĐ/tháng. Chúng tôi cũng thường xuyên có các chương trình 
              khuyến mãi và học bổng cho học viên xuất sắc. Vui lòng truy cập trang Học phí để biết 
              thông tin chi tiết về các gói học và quyền lợi đi kèm.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-8" className="border border-blue-100 rounded-xl overflow-hidden">
            <AccordionTrigger className="px-6 py-4 hover:bg-blue-50 text-left font-medium text-blue-600">
              Tôi có thể dùng thử nền tảng trước khi đăng ký không?
            </AccordionTrigger>
            <AccordionContent className="px-6 py-4 bg-blue-50 text-gray-700">
              Có, chúng tôi cung cấp gói dùng thử miễn phí trong 7 ngày, cho phép bạn trải nghiệm 
              các tính năng cơ bản của nền tảng và một số bài học mẫu. Điều này giúp bạn có cái nhìn 
              tổng quan về phương pháp giảng dạy và nội dung học tập trước khi quyết định đăng ký. 
              Để bắt đầu dùng thử, bạn chỉ cần đăng ký tài khoản và chọn gói dùng thử miễn phí.
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <div className="mt-10 bg-blue-50 p-6 rounded-xl border border-blue-100">
          <h2 className="text-xl font-semibold text-blue-600 mb-4">Bạn có câu hỏi khác?</h2>
          <p className="text-gray-700 mb-4">
            Nếu bạn không tìm thấy câu trả lời cho câu hỏi của mình, vui lòng liên hệ với đội ngũ hỗ trợ của chúng tôi. 
            Chúng tôi sẽ phản hồi trong thời gian sớm nhất.
          </p>
          <Link 
            href="/contact" 
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Liên hệ hỗ trợ
          </Link>
        </div>
      </div>
    </div>
  );
} 