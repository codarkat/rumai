import Link from "next/link";
import { SITE_CONFIG } from "@/constants/site";
import { Button } from "@/components/ui/button";

export function CTA() {
  return (
    <section className="container mx-auto py-20 px-4">
      <div className="relative overflow-hidden rounded-3xl">
        {/* Background with blue/sky gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-blue-500 to-sky-400"></div>

        {/* Pattern overlay */}
        <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,transparent,white,transparent)]"></div>

        {/* Decorative blurs */}
        <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 right-1/4 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/3 right-1/3 w-24 h-24 bg-sky-300/20 rounded-full blur-2xl"></div>

        <div className="relative p-8 md:p-16 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            {SITE_CONFIG.ctaTitle}
          </h2>

          <p className="text-xl text-blue-50 mb-10 max-w-2xl mx-auto">
            {SITE_CONFIG.ctaDescription}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              size="lg"
              className="bg-white text-blue-600 hover:bg-blue-50 hover:text-blue-700"
            >
              <Link href="/personal">{SITE_CONFIG.ctaButtonText}</Link>
            </Button>

            <Button
              asChild
              size="lg"
              variant="outline"
              className="bg-blue-700/30 border-white/30 text-white hover:bg-blue-700/50 hover:border-white/50"
            >
              <Link href="/about">Tìm hiểu thêm</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
