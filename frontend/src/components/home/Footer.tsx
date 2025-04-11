import Link from "next/link";
import { FOOTER_LINKS } from "@/constants/footer";
import { NAV_MENU, SITE_CONFIG } from "@/constants/site";
import { Separator } from "@/components/ui/separator";
import { Facebook, Twitter, Instagram, Youtube } from "lucide-react";

export function Footer() {
  const socialIcons = {
    facebook: <Facebook className="w-5 h-5" />,
    twitter: <Twitter className="w-5 h-5" />,
    instagram: <Instagram className="w-5 h-5" />,
    youtube: <Youtube className="w-5 h-5" />,
  };

  return (
    <footer className="bg-gradient-to-b from-white to-sky-50 border-t border-blue-100 py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-sky-500 mb-4">
              {SITE_CONFIG.name}
            </div>
            <p className="text-slate-600 mb-6 max-w-md">{SITE_CONFIG.slogan}</p>
            <div className="flex gap-4">
              {Object.entries(socialIcons).map(([name, icon]) => (
                <a
                  key={name}
                  href="#"
                  className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-sky-400 flex items-center justify-center text-white hover:shadow-md hover:shadow-blue-200/50 transition-all"
                >
                  <span className="sr-only">{name}</span>
                  {icon}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-blue-900 mb-4">Khám phá</h3>
            <ul className="space-y-3">
              {NAV_MENU.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-slate-600 hover:text-blue-600 transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-blue-900 mb-4">
              Pháp lý & Hỗ trợ
            </h3>
            <ul className="space-y-3">
              {FOOTER_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-slate-600 hover:text-blue-600 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/faq"
                  className="text-slate-600 hover:text-blue-600 transition-colors"
                >
                  Câu hỏi thường gặp
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <Separator className="my-10 bg-blue-100" />

        <div className="text-center text-slate-500">
          <p>
            &copy; {new Date().getFullYear()} {SITE_CONFIG.name}. Tất cả các
            quyền được bảo lưu.
          </p>
        </div>
      </div>
    </footer>
  );
}
