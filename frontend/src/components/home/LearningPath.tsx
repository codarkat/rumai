import { Languages, BookOpen, GraduationCap, Mic } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function LearningPath() {
  const steps = [
    {
      title: "Làm quen với bảng chữ cái",
      description:
        "Học cách phát âm và viết các chữ cái trong bảng chữ cái Cyrillic",
      icon: Languages,
      align: "left",
    },
    {
      title: "Từ vựng cơ bản",
      description: "Xây dựng vốn từ vựng cần thiết cho giao tiếp hàng ngày",
      icon: BookOpen,
      align: "right",
    },
    {
      title: "Ngữ pháp nền tảng",
      description: "Hiểu và áp dụng các quy tắc ngữ pháp cơ bản của tiếng Nga",
      icon: GraduationCap,
      align: "left",
    },
    {
      title: "Luyện nói và nghe",
      description:
        "Phát triển kỹ năng giao tiếp thông qua các bài học tương tác",
      icon: Mic,
      align: "right",
    },
  ];

  return (
    <section className="container mx-auto py-24 px-4">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <Badge className="mb-4 bg-blue-100 text-blue-700 hover:bg-blue-200 border-transparent">
          <span className="flex h-2 w-2 rounded-full bg-blue-500 mr-1"></span>
          Lộ trình học tập
        </Badge>

        <h2 className="text-4xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-sky-500">
          Hành trình chinh phục tiếng Nga
        </h2>

        <p className="text-lg text-slate-600">
          Lộ trình học tập được thiết kế khoa học giúp bạn tiến bộ nhanh chóng
        </p>
      </div>

      <div className="relative">
        {/* Timeline center line with animation */}
        <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1.5 bg-gradient-to-b from-blue-500 to-sky-400 rounded-full hidden md:block">
          <div className="absolute inset-0 bg-gradient-to-b from-blue-400 to-sky-300 rounded-full animate-pulse"></div>
        </div>

        {steps.map((step, index) => (
          <div
            key={index}
            className={`flex items-center mb-16 last:mb-0 ${
              step.align === "right" ? "md:flex-row-reverse" : ""
            }`}
          >
            <div className="md:w-1/2 p-4">
              <Card
                className={`max-w-lg hover:shadow-xl transition-all duration-300 ${
                  step.align === "right" ? "md:ml-auto" : "md:mr-auto"
                } border-blue-100 hover:border-blue-200 group`}
              >
                <CardHeader className="pb-2">
                  <div className="mb-2 inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-r from-blue-600 to-sky-500 text-white group-hover:shadow-md group-hover:shadow-blue-200 transition-all duration-300">
                    <step.icon className="w-7 h-7" />
                  </div>
                </CardHeader>

                <CardContent>
                  <h3 className="text-2xl font-bold text-blue-900 mb-3">
                    {step.title}
                  </h3>
                  <p className="text-slate-600 leading-relaxed">
                    {step.description}
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="hidden md:flex items-center justify-center relative z-10">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-600 to-sky-500 shadow-lg flex items-center justify-center text-white font-bold text-lg relative">
                <span className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-500 to-sky-400 animate-ping opacity-50 duration-1000"></span>
                <span>{index + 1}</span>
              </div>
            </div>

            <div className="md:w-1/2 p-4 hidden md:block"></div>
          </div>
        ))}
      </div>
    </section>
  );
}
