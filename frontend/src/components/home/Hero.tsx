import Link from "next/link";
import { SITE_CONFIG } from "@/constants/site";
import Image from "next/image";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";

export function Hero() {
  // Russian-themed image with blue/sky focus
  const backgroundImageUrl =
    "https://images.unsplash.com/photo-1513326738677-b964603b136d?q=80&w=2000&auto=format&fit=crop";

  return (
    <section className="relative min-h-screen w-full flex items-center overflow-hidden">
      {/* Background with Russian theme */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-950/90 to-sky-800/80 z-10"></div>
        <Image
          src={backgroundImageUrl}
          alt="Russian Winter Palace, St. Petersburg"
          fill
          sizes="100vw"
          className="object-cover"
          priority
        />
      </div>

      <div className="container mx-auto px-4 pt-20 z-20 flex flex-col lg:flex-row items-center gap-12">
        <div className="lg:w-1/2 space-y-8">
          <Badge
            variant="outline"
            className="px-4 py-1.5 bg-blue-500/10 border-blue-300/20 backdrop-blur-md text-white gap-2"
          >
            <span className="flex h-2 w-2 rounded-full bg-sky-400"></span>
            <span>Nền tảng học tiếng Nga hàng đầu</span>
          </Badge>

          <h1 className="text-5xl md:text-6xl xl:text-7xl font-bold text-white">
            {SITE_CONFIG.heroTitle}
          </h1>

          <p className="text-xl text-sky-100 max-w-xl leading-relaxed">
            {SITE_CONFIG.heroDescription}
          </p>

          <div className="flex flex-wrap gap-4">
            <Button
              asChild
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-sky-500 hover:from-blue-700 hover:to-sky-600 text-white"
            >
              <Link href="/personal">Bắt đầu học</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="bg-white/5 border-white/20 text-white hover:bg-white/10 hover:border-white/30"
            >
              <Link href="/about">Tìm hiểu thêm</Link>
            </Button>
          </div>

          <div className="flex items-center gap-2 text-sky-100 mt-8">
            <div className="flex -space-x-2">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className={`w-10 h-10 rounded-full border-2 border-blue-400/80 flex items-center justify-center text-xs font-bold bg-gradient-to-br ${
                    [
                      "from-blue-400 to-sky-500",
                      "from-sky-400 to-blue-500",
                      "from-blue-500 to-sky-600",
                      "from-sky-500 to-blue-600",
                    ][i]
                  }`}
                >
                  {["DC", "XC", "ML", "TK"][i]}
                </div>
              ))}
            </div>
            <div className="ml-2">
              <div className="font-medium text-white">
                Đã có 10,000+ người học
              </div>
              <div className="text-sm text-sky-200">Tham gia ngay hôm nay</div>
            </div>
          </div>
        </div>

        <div className="lg:w-1/2 mt-12 lg:mt-0">
          <div className="relative">
            {/* Russian-styled background elements */}
            <div className="absolute -top-10 -left-10 w-24 h-24 bg-blue-500/20 rounded-full blur-2xl"></div>
            <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-sky-500/20 rounded-full blur-2xl"></div>
            <div className="absolute top-1/2 left-1/4 w-20 h-20 bg-blue-600/20 rounded-full blur-xl"></div>

            <Card className="relative border-white/10 bg-white/5 backdrop-blur-md shadow-xl">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <h3 className="text-3xl font-bold text-white">
                  <span className="text-sky-300">Русский</span> язык
                </h3>
                <div className="flex gap-2">
                  {[...Array(3)].map((_, i) => (
                    <div
                      key={i}
                      className={`w-3 h-3 rounded-full ${
                        ["bg-blue-500", "bg-sky-500", "bg-blue-400"][i]
                      }`}
                    ></div>
                  ))}
                </div>
              </CardHeader>

              <CardContent className="space-y-6 pt-4">
                <div className="flex gap-4 items-start">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-600 to-sky-500 flex items-center justify-center text-white font-bold text-lg shrink-0">
                    Р
                  </div>
                  <div className="bg-white/10 backdrop-blur-md rounded-2xl rounded-tl-none p-4 text-white border border-white/10">
                    <p className="font-medium text-sky-100">
                      Здравствуйте! Как дела?
                    </p>
                    <div className="text-sm text-sky-200 mt-1">
                      Xin chào! Bạn khỏe không?
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 items-start flex-row-reverse">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-sky-500 to-blue-600 flex items-center justify-center text-white font-bold text-lg shrink-0">
                    B
                  </div>
                  <div className="bg-blue-600/20 backdrop-blur-md rounded-2xl rounded-tr-none p-4 text-white border border-white/10">
                    <p className="font-medium text-sky-100">
                      Я хочу выучить русский язык.
                    </p>
                    <div className="text-sm text-sky-200 mt-1">
                      Tôi muốn học tiếng Nga.
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-600 to-sky-500 flex items-center justify-center text-white font-bold text-lg shrink-0">
                    Р
                  </div>
                  <div className="bg-white/10 backdrop-blur-md rounded-2xl rounded-tl-none p-4 text-white border border-white/10">
                    <p className="font-medium text-sky-100">
                      Превосходно! Давайте начнем!
                    </p>
                    <div className="text-sm text-sky-200 mt-1">
                      Tuyệt vời! Hãy bắt đầu!
                    </div>
                  </div>
                </div>
              </CardContent>

              <CardFooter className="border-t border-white/10 pt-4">
                <Button
                  asChild
                  className="w-full bg-gradient-to-r from-blue-600 to-sky-500 hover:from-blue-700 hover:to-sky-600 text-white"
                >
                  <Link href="/personal">Начать сейчас! (Bắt đầu ngay!)</Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>

      {/* Scroll down indicator */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 text-white text-center z-20">
        <div className="animate-bounce">
          <ChevronDown className="w-6 h-6 mx-auto text-sky-300" />
        </div>
        <span className="text-sm mt-2 text-sky-200">Cuộn xuống</span>
      </div>
    </section>
  );
}
