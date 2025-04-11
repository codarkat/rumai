"use client";
import React, { useState } from "react";
import Head from "next/head";
import { SITE_CONFIG } from "@/constants/site";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Dữ liệu bảng chữ cái tiếng Nga
const russianAlphabet = [
  {
    letter: "А а",
    pronunciation: "a",
    example: "автобус (avtobus) - xe buýt",
    sound: "/sounds/a.mp3",
  },
  {
    letter: "Б б",
    pronunciation: "b",
    example: "банк (bank) - ngân hàng",
    sound: "/sounds/b.mp3",
  },
  {
    letter: "В в",
    pronunciation: "v",
    example: "вода (voda) - nước",
    sound: "/sounds/v.mp3",
  },
  {
    letter: "Г г",
    pronunciation: "g",
    example: "город (gorod) - thành phố",
    sound: "/sounds/g.mp3",
  },
  {
    letter: "Д д",
    pronunciation: "d",
    example: "дом (dom) - nhà",
    sound: "/sounds/d.mp3",
  },
  {
    letter: "Е е",
    pronunciation: "ye",
    example: "ем (yem) - tôi ăn",
    sound: "/sounds/ye.mp3",
  },
  {
    letter: "Ё ё",
    pronunciation: "yo",
    example: "ёлка (yolka) - cây thông",
    sound: "/sounds/yo.mp3",
  },
  {
    letter: "Ж ж",
    pronunciation: "zh",
    example: "жизнь (zhizn) - cuộc sống",
    sound: "/sounds/zh.mp3",
  },
  {
    letter: "З з",
    pronunciation: "z",
    example: "зима (zima) - mùa đông",
    sound: "/sounds/z.mp3",
  },
  {
    letter: "И и",
    pronunciation: "i",
    example: "игра (igra) - trò chơi",
    sound: "/sounds/i.mp3",
  },
  {
    letter: "Й й",
    pronunciation: "y",
    example: "йогурт (yogurt) - sữa chua",
    sound: "/sounds/y.mp3",
  },
  {
    letter: "К к",
    pronunciation: "k",
    example: "кот (kot) - con mèo",
    sound: "/sounds/k.mp3",
  },
  {
    letter: "Л л",
    pronunciation: "l",
    example: "лампа (lampa) - đèn",
    sound: "/sounds/l.mp3",
  },
  {
    letter: "М м",
    pronunciation: "m",
    example: "мама (mama) - mẹ",
    sound: "/sounds/m.mp3",
  },
  {
    letter: "Н н",
    pronunciation: "n",
    example: "нос (nos) - mũi",
    sound: "/sounds/n.mp3",
  },
  {
    letter: "О о",
    pronunciation: "o",
    example: "окно (okno) - cửa sổ",
    sound: "/sounds/o.mp3",
  },
  {
    letter: "П п",
    pronunciation: "p",
    example: "папа (papa) - bố",
    sound: "/sounds/p.mp3",
  },
  {
    letter: "Р р",
    pronunciation: "r",
    example: "рука (ruka) - tay",
    sound: "/sounds/r.mp3",
  },
  {
    letter: "С с",
    pronunciation: "s",
    example: "сок (sok) - nước ép",
    sound: "/sounds/s.mp3",
  },
  {
    letter: "Т т",
    pronunciation: "t",
    example: "там (tam) - ở đó",
    sound: "/sounds/t.mp3",
  },
  {
    letter: "У у",
    pronunciation: "u",
    example: "утро (utro) - buổi sáng",
    sound: "/sounds/u.mp3",
  },
  {
    letter: "Ф ф",
    pronunciation: "f",
    example: "фото (foto) - ảnh",
    sound: "/sounds/f.mp3",
  },
  {
    letter: "Х х",
    pronunciation: "kh",
    example: "хлеб (khleb) - bánh mì",
    sound: "/sounds/kh.mp3",
  },
  {
    letter: "Ц ц",
    pronunciation: "ts",
    example: "центр (tsentr) - trung tâm",
    sound: "/sounds/ts.mp3",
  },
  {
    letter: "Ч ч",
    pronunciation: "ch",
    example: "час (chas) - giờ",
    sound: "/sounds/ch.mp3",
  },
  {
    letter: "Ш ш",
    pronunciation: "sh",
    example: "школа (shkola) - trường học",
    sound: "/sounds/sh.mp3",
  },
  {
    letter: "Щ щ",
    pronunciation: "shch",
    example: "щека (shcheka) - má",
    sound: "/sounds/shch.mp3",
  },
  {
    letter: "Ъ ъ",
    pronunciation: "dấu cứng",
    example: "объект (obyekt) - đối tượng",
    sound: "/sounds/hard-sign.mp3",
  },
  {
    letter: "Ы ы",
    pronunciation: "y",
    example: "ты (ty) - bạn",
    sound: "/sounds/y-hard.mp3",
  },
  {
    letter: "Ь ь",
    pronunciation: "dấu mềm",
    example: "мать (mat') - mẹ",
    sound: "/sounds/soft-sign.mp3",
  },
  {
    letter: "Э э",
    pronunciation: "e",
    example: "это (eto) - cái này",
    sound: "/sounds/e.mp3",
  },
  {
    letter: "Ю ю",
    pronunciation: "yu",
    example: "юг (yug) - phía nam",
    sound: "/sounds/yu.mp3",
  },
  {
    letter: "Я я",
    pronunciation: "ya",
    example: "яблоко (yabloko) - quả táo",
    sound: "/sounds/ya.mp3",
  },
];

// Phân loại chữ cái theo nhóm
const alphabetGroups = {
  group1: ["А", "К", "М", "О", "Т"],
  group2: ["В", "Е", "Н", "Р", "С", "У", "Х"],
  group3: [
    "Б",
    "Г",
    "Д",
    "Ж",
    "З",
    "И",
    "Й",
    "Л",
    "П",
    "Ф",
    "Ц",
    "Ч",
    "Ш",
    "Щ",
    "Ъ",
    "Ы",
    "Ь",
    "Э",
    "Ю",
    "Я",
  ],
};

// Phương pháp học hiệu quả
const learningMethods = [
  {
    title: "Phương pháp 5 bước",
    icon: "📝",
    description:
      "Phương pháp học bảng chữ cái tiếng Nga hiệu quả qua 5 bước đơn giản",
    steps: [
      "Bước 1: Học cách phát âm từng chữ cái",
      "Bước 2: Tập viết chữ cái (cả in hoa và thường)",
      "Bước 3: Học các từ đơn giản bắt đầu bằng chữ cái đó",
      "Bước 4: Tạo flashcards để ôn tập hàng ngày",
      "Bước 5: Luyện nghe và phát âm thường xuyên",
    ],
  },
  {
    title: "Phân nhóm chữ cái",
    icon: "🔍",
    description: "Chia bảng chữ cái thành các nhóm nhỏ để học dễ dàng hơn:",
    groups: [
      "Nhóm 1: Chữ cái giống tiếng Anh về hình dạng và âm thanh (А, К, М, О, Т)",
      "Nhóm 2: Chữ cái giống tiếng Anh về hình dạng nhưng khác âm thanh (В, Е, Н, Р, С, У, Х)",
      "Nhóm 3: Chữ cái khác tiếng Anh hoàn toàn (Б, Г, Д, Ж, З, И, Й, Л, П, Ф, Ц, Ч, Ш, Щ, Ъ, Ы, Ь, Э, Ю, Я)",
    ],
  },
  {
    title: "Lịch trình học tối ưu",
    icon: "📅",
    description: "Kế hoạch học tập hiệu quả theo thời gian",
    schedule: [
      "Ngày 1-3: Tập trung vào nhóm 1 (5 chữ cái)",
      "Ngày 4-10: Học nhóm 2 (7 chữ cái)",
      "Ngày 11-30: Học nhóm 3 (20 chữ cái)",
      "Mỗi ngày dành 20-30 phút để ôn tập các chữ cái đã học",
      "Cuối tuần dành 1 giờ để ôn tập tổng hợp",
    ],
  },
  {
    title: "Công cụ học tập hiệu quả",
    icon: "🛠️",
    description: "Các công cụ và tài nguyên hỗ trợ việc học bảng chữ cái",
    tools: [
      "Ứng dụng di động: Duolingo, Memrise, Russian Alphabet Mastery",
      "Flashcards (thẻ ghi nhớ): Anki, Quizlet",
      "Sách tham khảo: The New Penguin Russian Course",
      "Kênh YouTube: Russian From Russia, Be Fluent in Russian",
      "Podcast: Russian Made Easy, RussianPod101",
    ],
  },
];

export default function AlphabetPage() {
  const [hoveredLetter, setHoveredLetter] = useState<string | null>(null);

  return (
    <>
      <Head>
        <title>Bảng chữ cái tiếng Nga | {SITE_CONFIG.name}</title>
        <meta
          name="description"
          content="Học bảng chữ cái tiếng Nga và phương pháp học hiệu quả"
        />
      </Head>

      <div className="w-full">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
            Bảng chữ cái tiếng Nga
          </h1>

          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Bảng chữ cái tiếng Nga (Кириллица - Kirillitsa) gồm 33 chữ cái. Dưới
            đây là toàn bộ bảng chữ cái cùng cách phát âm và ví dụ để bạn học
            hiệu quả.
          </p>
        </div>

        {/* Tabs for Alphabet Groups */}
        <Tabs defaultValue="all" className="mb-12">
          <TabsList className="w-full flex justify-center mb-8">
            <TabsTrigger value="all">Tất cả chữ cái</TabsTrigger>
            <TabsTrigger value="group1">Nhóm 1 (Giống tiếng Anh)</TabsTrigger>
            <TabsTrigger value="group2">Nhóm 2 (Giống hình dạng)</TabsTrigger>
            <TabsTrigger value="group3">Nhóm 3 (Khác hoàn toàn)</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {russianAlphabet.map((item, index) => (
                <AlphabetCard
                  key={index}
                  item={item}
                  hoveredLetter={hoveredLetter}
                  setHoveredLetter={setHoveredLetter}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="group1" className="mt-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {russianAlphabet
                .filter((item) =>
                  alphabetGroups.group1.includes(item.letter.charAt(0))
                )
                .map((item, index) => (
                  <AlphabetCard
                    key={index}
                    item={item}
                    hoveredLetter={hoveredLetter}
                    setHoveredLetter={setHoveredLetter}
                    groupColor="sky"
                  />
                ))}
            </div>
          </TabsContent>

          <TabsContent value="group2" className="mt-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {russianAlphabet
                .filter((item) =>
                  alphabetGroups.group2.includes(item.letter.charAt(0))
                )
                .map((item, index) => (
                  <AlphabetCard
                    key={index}
                    item={item}
                    hoveredLetter={hoveredLetter}
                    setHoveredLetter={setHoveredLetter}
                    groupColor="blue"
                  />
                ))}
            </div>
          </TabsContent>

          <TabsContent value="group3" className="mt-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {russianAlphabet
                .filter((item) =>
                  alphabetGroups.group3.includes(item.letter.charAt(0))
                )
                .map((item, index) => (
                  <AlphabetCard
                    key={index}
                    item={item}
                    hoveredLetter={hoveredLetter}
                    setHoveredLetter={setHoveredLetter}
                    groupColor="indigo"
                  />
                ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Learning Methods Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-10 text-foreground">
            Phương pháp học bảng chữ cái tiếng Nga hiệu quả
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {learningMethods.map((method, index) => (
              <Card key={index} className="border border-border">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{method.icon}</span>
                    <CardTitle>{method.title}</CardTitle>
                  </div>
                  <CardDescription>{method.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {method.steps &&
                      method.steps.map((step, idx) => (
                        <li
                          key={idx}
                          className="text-foreground flex items-start"
                        >
                          <span className="text-primary mr-2">•</span>
                          <span>{step}</span>
                        </li>
                      ))}

                    {method.groups &&
                      method.groups.map((group, idx) => (
                        <li
                          key={idx}
                          className="text-foreground flex items-start"
                        >
                          <span className="text-primary mr-2">•</span>
                          <span>{group}</span>
                        </li>
                      ))}

                    {method.schedule &&
                      method.schedule.map((item, idx) => (
                        <li
                          key={idx}
                          className="text-foreground flex items-start"
                        >
                          <span className="text-primary mr-2">•</span>
                          <span>{item}</span>
                        </li>
                      ))}

                    {method.tools &&
                      method.tools.map((tool, idx) => (
                        <li
                          key={idx}
                          className="text-foreground flex items-start"
                        >
                          <span className="text-primary mr-2">•</span>
                          <span>{tool}</span>
                        </li>
                      ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Expert Advice Section */}
        <Card className="bg-sky-500 text-white mb-16">
          <CardHeader>
            <CardTitle className="text-center">
              Lời khuyên từ chuyên gia
            </CardTitle>
          </CardHeader>
          <CardContent className="max-w-3xl mx-auto">
            <p className="mb-4">
              Học bảng chữ cái là bước đầu tiên và quan trọng nhất khi học tiếng
              Nga. Hãy dành thời gian để thành thạo cách phát âm và nhận diện
              từng chữ cái trước khi chuyển sang học từ vựng và ngữ pháp.
            </p>
            <p className="mb-4">
              Nên kết hợp nhiều phương pháp học khác nhau: nghe, nhìn, viết và
              nói. Điều này giúp não bộ ghi nhớ thông tin tốt hơn và lâu hơn.
            </p>
            <p>
              Hãy kiên nhẫn và thực hành đều đặn mỗi ngày. Chỉ cần 15-30 phút
              mỗi ngày, bạn sẽ thành thạo bảng chữ cái tiếng Nga trong vòng 2-4
              tuần.
            </p>
          </CardContent>
        </Card>

        {/* Call to Action */}
        <div className="text-center">
          <h3 className="text-2xl font-bold mb-6 text-foreground">
            Bắt đầu hành trình học tiếng Nga của bạn ngay hôm nay!
          </h3>
          <Button size="lg" className="px-8 bg-blue-600 hover:bg-blue-700">
            Bắt đầu học ngay
          </Button>
        </div>
      </div>
    </>
  );
}

// Component cho thẻ chữ cái
function AlphabetCard({
  item,
  hoveredLetter,
  setHoveredLetter,
  groupColor,
}: {
  item: (typeof russianAlphabet)[0];
  hoveredLetter: string | null;
  setHoveredLetter: (letter: string | null) => void;
  groupColor?: "sky" | "blue" | "indigo";
}) {
  const isHovered = hoveredLetter === item.letter;

  let colorClasses = "";
  if (groupColor === "sky") {
    colorClasses = "border-sky-200 bg-sky-50 hover:border-sky-300";
  } else if (groupColor === "blue") {
    colorClasses = "border-blue-200 bg-blue-50 hover:border-blue-300";
  } else if (groupColor === "indigo") {
    colorClasses = "border-indigo-200 bg-indigo-50 hover:border-indigo-300";
  }

  return (
    <Card
      className={cn(
        "border-2 overflow-hidden transition-all duration-300",
        colorClasses,
        isHovered ? "scale-105 shadow-lg" : ""
      )}
      onMouseEnter={() => setHoveredLetter(item.letter)}
      onMouseLeave={() => setHoveredLetter(null)}
    >
      <CardContent className="p-6">
        <div className="text-5xl font-bold text-center mb-4 text-primary">
          {item.letter}
        </div>
        <div className="h-0.5 w-16 bg-primary/30 mx-auto mb-4"></div>
        <p className="mb-2">
          <span className="font-semibold">Phát âm:</span> {item.pronunciation}
        </p>
        <p>
          <span className="font-semibold">Ví dụ:</span> {item.example}
        </p>
        {/* <div className="mt-4 text-center">
          <audio controls src={item.sound} className="w-full">
            Trình duyệt của bạn không hỗ trợ phát âm thanh
          </audio>
        </div> */}
      </CardContent>
    </Card>
  );
}
