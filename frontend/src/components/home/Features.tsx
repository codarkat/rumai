import { FEATURES } from "@/constants/features";
import { SITE_CONFIG } from "@/constants/site";
import { LucideIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function Features() {
  return (
    <section className="py-20 px-4">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge className="mb-4 bg-blue-100 text-blue-700 hover:bg-blue-200 border-transparent">
            <span className="flex h-2 w-2 rounded-full bg-blue-500 mr-1"></span>
            Tính năng nổi bật
          </Badge>

          <h2 className="text-4xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-sky-500">
            {SITE_CONFIG.featuresTitle}
          </h2>

          <p className="text-lg text-slate-600">
            Khám phá các tính năng giúp việc học tiếng Nga trở nên dễ dàng và
            hiệu quả hơn
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {FEATURES.map((feature, index) => {
            const Icon = feature.icon as LucideIcon;

            return (
              <Card
                key={index}
                className="border-blue-100 bg-white shadow-lg hover:shadow-xl hover:shadow-blue-100/50 transition-all duration-300 hover:-translate-y-1"
              >
                <CardHeader>
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-sky-400 rounded-xl flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-110 transition-transform duration-300">
                    <Icon className="h-6 w-6" />
                  </div>
                </CardHeader>

                <CardContent>
                  <h3 className="text-xl font-semibold text-blue-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-slate-600">{feature.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
