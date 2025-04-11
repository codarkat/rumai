import { Card, CardContent } from "@/components/ui/card";

export function Stats() {
  const stats = [
    { number: "33", label: "Chữ cái", color: "text-blue-600" },
    { number: "5000+", label: "Từ vựng", color: "text-sky-500" },
    { number: "100+", label: "Bài học", color: "text-blue-700" },
    { number: "24/7", label: "Hỗ trợ", color: "text-sky-600" },
  ];

  return (
    <section className="container mx-auto py-20 px-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
        {stats.map((stat, index) => (
          <Card
            key={index}
            className="border-blue-100 shadow-md hover:shadow-lg hover:shadow-blue-100/30 transition-all"
          >
            <CardContent className="flex flex-col items-center justify-center py-6">
              <div
                className={`text-4xl md:text-5xl font-bold ${stat.color} mb-2`}
              >
                {stat.number}
              </div>
              <div className="text-slate-600">{stat.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
