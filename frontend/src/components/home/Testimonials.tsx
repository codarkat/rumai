import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
} from "@/components/ui/card";
import { Star } from "lucide-react";

export function Testimonials() {
  const testimonials = [
    {
      name: "Nguyễn Văn A",
      role: "Sinh viên",
      content:
        "Tôi đã học tiếng Nga được 6 tháng và đã có thể giao tiếp cơ bản. Phương pháp học ở đây rất hiệu quả và thú vị!",
      avatar: "A",
    },
    {
      name: "Trần Thị B",
      role: "Nhân viên văn phòng",
      content:
        "Tôi cần học tiếng Nga để công việc và đã đạt được mục tiêu nhanh hơn dự kiến. Cảm ơn vì những bài học tuyệt vời!",
      avatar: "B",
    },
    {
      name: "Lê Văn C",
      role: "Hướng dẫn viên du lịch",
      content:
        "Nhờ khóa học này mà tôi đã có thể giao tiếp với khách du lịch người Nga. Đây là một khoản đầu tư tuyệt vời cho sự nghiệp của tôi.",
      avatar: "C",
    },
  ];

  return (
    <section className="container mx-auto py-24 px-4">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <Badge className="mb-4 bg-blue-100 text-blue-700 hover:bg-blue-200 border-transparent">
          <span className="flex h-2 w-2 rounded-full bg-blue-500 mr-1"></span>
          Học viên nói gì về chúng tôi
        </Badge>

        <h2 className="text-4xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-sky-500">
          Câu chuyện thành công
        </h2>

        <p className="text-lg text-slate-600">
          Hàng nghìn học viên đã thành công trong việc học tiếng Nga cùng chúng
          tôi
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {testimonials.map((testimonial, index) => (
          <Card
            key={index}
            className="border-blue-100 shadow-lg hover:shadow-xl hover:shadow-blue-100/20 transition-all"
          >
            <CardHeader className="pb-3">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-600 to-sky-500 flex items-center justify-center text-white font-bold shadow-md shadow-blue-200/50">
                  {testimonial.avatar}
                </div>
                <div>
                  <div className="font-semibold text-blue-900">
                    {testimonial.name}
                  </div>
                  <div className="text-sm text-slate-500">
                    {testimonial.role}
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <div className="text-slate-600 italic">
                "{testimonial.content}"
              </div>
            </CardContent>

            <CardFooter className="pt-1">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="text-blue-500 fill-blue-500 w-4 h-4"
                  />
                ))}
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  );
}
