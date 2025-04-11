import Link from 'next/link';
import Image from 'next/image';
import { FaArrowLeft, FaLinkedin, FaGraduationCap, FaLanguage } from 'react-icons/fa';

export const metadata = {
  title: 'Đội ngũ giảng viên | Học tiếng Nga',
  description: 'Gặp gỡ đội ngũ giảng viên giàu kinh nghiệm và đam mê của chúng tôi',
};

const teachers = [
  {
    id: 1,
    name: 'TS. Nguyễn Văn A',
    role: 'Giảng viên chính - Ngữ pháp & Ngữ âm',
    image: '/images/teacher-placeholder.jpg',
    bio: 'Tiến sĩ Ngôn ngữ học tại Đại học Quốc gia Moscow, với hơn 15 năm kinh nghiệm giảng dạy tiếng Nga. Chuyên gia về ngữ pháp và ngữ âm học tiếng Nga.',
    education: 'Tiến sĩ Ngôn ngữ học, Đại học Quốc gia Moscow',
    experience: '15+ năm kinh nghiệm giảng dạy',
    specialization: 'Ngữ pháp, Ngữ âm học, Phương pháp giảng dạy',
  },
  {
    id: 2,
    name: 'ThS. Trần Thị B',
    role: 'Giảng viên - Giao tiếp & Văn hóa',
    image: '/images/teacher-placeholder.jpg',
    bio: 'Thạc sĩ Văn hóa Nga tại Đại học Saint Petersburg, sống và làm việc tại Nga 10 năm. Chuyên gia về văn hóa và giao tiếp tiếng Nga trong đời sống hàng ngày.',
    education: 'Thạc sĩ Văn hóa Nga, Đại học Saint Petersburg',
    experience: '10+ năm kinh nghiệm giảng dạy',
    specialization: 'Kỹ năng giao tiếp, Văn hóa Nga, Tiếng Nga thực hành',
  },
  {
    id: 3,
    name: 'ThS. Lê Văn C',
    role: 'Giảng viên - Từ vựng & Đọc hiểu',
    image: '/images/teacher-placeholder.jpg',
    bio: 'Thạc sĩ Ngôn ngữ Nga tại Đại học Tổng hợp Quốc gia Moscow, với 8 năm kinh nghiệm giảng dạy. Chuyên gia về phát triển từ vựng và kỹ năng đọc hiểu.',
    education: 'Thạc sĩ Ngôn ngữ Nga, Đại học Tổng hợp Quốc gia Moscow',
    experience: '8+ năm kinh nghiệm giảng dạy',
    specialization: 'Phát triển từ vựng, Kỹ năng đọc hiểu, Văn học Nga',
  },
  {
    id: 4,
    name: 'CN. Phạm Thị D',
    role: 'Trợ giảng - Luyện thi chứng chỉ',
    image: '/images/teacher-placeholder.jpg',
    bio: 'Cử nhân Ngôn ngữ Nga tại Đại học Ngoại ngữ Hà Nội, đạt chứng chỉ TORFL cấp độ C1. Chuyên gia về luyện thi các chứng chỉ tiếng Nga quốc tế.',
    education: 'Cử nhân Ngôn ngữ Nga, Đại học Ngoại ngữ Hà Nội',
    experience: '5+ năm kinh nghiệm giảng dạy',
    specialization: 'Luyện thi chứng chỉ TORFL, Kỹ năng viết, Nghe hiểu',
  },
];

export default function TeamPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      <Link 
        href="/about" 
        className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-8 group"
      >
        <FaArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" />
        Quay lại trang giới thiệu
      </Link>

      <div className="bg-white rounded-2xl shadow-md p-8 mb-12">
        <h1 className="text-3xl font-bold text-blue-600 mb-6 border-b border-blue-100 pb-4">
          Đội ngũ giảng viên
        </h1>

        <p className="text-gray-700 mb-8 leading-relaxed">
          Đội ngũ giảng viên của chúng tôi bao gồm các chuyên gia ngôn ngữ giàu kinh nghiệm, 
          đam mê giảng dạy và có nền tảng học thuật vững chắc. Họ không chỉ là những người thầy 
          mà còn là người bạn đồng hành, luôn sẵn sàng hỗ trợ và truyền cảm hứng cho học viên 
          trong hành trình chinh phục tiếng Nga.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {teachers.map((teacher) => (
            <div key={teacher.id} className="bg-blue-50 rounded-xl p-6 border border-blue-100">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                  <div className="w-full h-full bg-gradient-to-br from-blue-400 to-sky-500 flex items-center justify-center text-white text-3xl font-bold">
                    {teacher.name.split(' ').pop()}
                  </div>
                </div>
                
                <div>
                  <h2 className="text-xl font-bold text-blue-600">{teacher.name}</h2>
                  <p className="text-blue-500 font-medium mb-2">{teacher.role}</p>
                  <p className="text-gray-700 mb-4">{teacher.bio}</p>
                  
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-start">
                      <FaGraduationCap className="mt-1 mr-2 text-blue-500" />
                      <span>{teacher.education}</span>
                    </div>
                    <div className="flex items-start">
                      <FaLanguage className="mt-1 mr-2 text-blue-500" />
                      <span>{teacher.specialization}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-blue-50 p-6 rounded-xl border border-blue-100">
          <h2 className="text-2xl font-semibold text-blue-600 mb-4">Tham gia đội ngũ của chúng tôi</h2>
          <p className="text-gray-700 mb-4">
            Chúng tôi luôn tìm kiếm những giảng viên tài năng và đam mê để mở rộng đội ngũ. 
            Nếu bạn có kinh nghiệm giảng dạy tiếng Nga và mong muốn tham gia vào một môi trường 
            giáo dục năng động, hãy liên hệ với chúng tôi.
          </p>
          <Link 
            href="/contact" 
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Liên hệ ngay
          </Link>
        </div>
      </div>
    </div>
  );
} 