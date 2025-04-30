"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Menu,
  X,
  ChevronDown,
  User,
  LogOut,
  Settings,
  BookOpen,
  History,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSession, signOut as authSignOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
} from "./_components/navigation-menu";
import { cn } from "@/lib/utils";

const navItems = [
  { name: "Trang chủ", href: "/" },
  { name: "Từ điển", href: "/dictionary" },
  {
    name: "Học tập",
    href: "#",
    dropdown: [
      { name: "Bảng chữ cái", href: "/alphabet" },
      { name: "Ngữ pháp", href: "/grammar" },
      { name: "Từ vựng", href: "/vocabulary" },
    ],
  },
  { name: "Tài liệu", href: "/documents" },
  { name: "Trợ lý AI", href: "/assistant" },
  { name: "Bài kiểm tra", href: "/tests" },
  { name: "Về chúng tôi", href: "/about" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const { data: session } = useSession();
  const profileRef = useRef<HTMLDivElement>(null);
  const profileButtonRef = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();

  // Check if we're on the home page
  const isHomePage = pathname === "/";

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [scrolled]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node) &&
        profileButtonRef.current &&
        !profileButtonRef.current.contains(event.target as Node)
      ) {
        setProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleDropdown = (name: string) => {
    if (activeDropdown === name) {
      setActiveDropdown(null);
    } else {
      setActiveDropdown(name);
    }
  };

  const toggleProfile = (e: React.MouseEvent) => {
    e.stopPropagation();
    setProfileOpen(!profileOpen);
  };

  const handleLogout = async () => {
    await authSignOut({ callbackUrl: "/auth/login" });
  };

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  const isDropdownActive = (items: { href: string }[]) => {
    return items.some((item) => isActive(item.href));
  };

  // Determine navbar style based on page and scroll state
  const getNavbarStyle = () => {
    if (isHomePage) {
      return scrolled
        ? "bg-white/80 backdrop-blur-xl border-b border-white/40 shadow-lg py-3"
        : "bg-transparent py-5 border-transparent";
    } else {
      return scrolled
        ? "bg-white/80 backdrop-blur-xl border-b border-white/40 shadow-lg py-3"
        : "bg-white/80 backdrop-blur-xl border-b border-white/40 shadow-lg py-3";
    }
  };

  // Determine text color based on page and scroll state
  const getTextColor = (active: boolean = false) => {
    if (isHomePage) {
      if (scrolled) {
        return active
          ? "text-sky-500 font-semibold"
          : "text-gray-700 hover:text-sky-500";
      } else {
        return active
          ? "text-white font-semibold"
          : "text-white/90 hover:text-white";
      }
    } else {
      return active
        ? "text-sky-500 font-semibold"
        : "text-gray-700 hover:text-sky-500";
    }
  };

  // Get icon color based on page and scroll state
  const getIconColor = () => {
    if (isHomePage && !scrolled) {
      return "text-white";
    }
    return "text-sky-500";
  };

  // Get mobile menu background
  const getMobileMenuBg = () => {
    if (isHomePage && !scrolled) {
      return "bg-black/50 backdrop-blur-xl border-b border-white/10";
    }
    return "bg-white/90 backdrop-blur-xl border-b border-white/40";
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${getNavbarStyle()} h-[64px]`}
    >
      <div className="container mx-auto px-4 h-full">
        <div className="flex items-center justify-between h-full">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <span
              className={`text-2xl font-bold transition-transform duration-300 hover:scale-105 ${
                isHomePage && !scrolled
                  ? "text-white"
                  : "bg-gradient-to-r from-sky-400 to-blue-600 bg-clip-text text-transparent"
              }`}
            >
              RumAI
            </span>
          </Link>

          {/* Desktop Navigation using NavigationMenu */}
          <div className="hidden md:block">
            <NavigationMenu>
              <NavigationMenuList className="gap-1">
                {navItems.map((item) => (
                  <NavigationMenuItem key={item.name}>
                    {item.dropdown ? (
                      <>
                        <NavigationMenuTrigger
                          className={cn(
                            "bg-transparent font-normal",
                            isHomePage && !scrolled
                              ? "text-white/90 hover:text-white hover:bg-white/10"
                              : "text-gray-700 hover:text-sky-500 hover:bg-sky-50",
                            isDropdownActive(item.dropdown) &&
                              (isHomePage && !scrolled
                                ? "text-white font-semibold"
                                : "text-sky-500 font-semibold")
                          )}
                        >
                          {item.name}
                        </NavigationMenuTrigger>
                        <NavigationMenuContent>
                          <ul className="grid gap-1 p-2 w-[180px]">
                            {item.dropdown.map((dropdownItem) => (
                              <li key={dropdownItem.name}>
                                <NavigationMenuLink asChild>
                                  <Link
                                    href={dropdownItem.href}
                                    className={cn(
                                      "block select-none rounded-md p-2 leading-none no-underline outline-none transition-colors",
                                      isActive(dropdownItem.href)
                                        ? "bg-gradient-to-r from-sky-50 to-blue-50 text-sky-600 font-medium"
                                        : "text-gray-700 hover:bg-gradient-to-r hover:from-sky-50 hover:to-blue-50 hover:text-sky-600"
                                    )}
                                  >
                                    {dropdownItem.name}
                                  </Link>
                                </NavigationMenuLink>
                              </li>
                            ))}
                          </ul>
                        </NavigationMenuContent>
                      </>
                    ) : (
                      <NavigationMenuLink asChild>
                        <Link
                          href={item.href}
                          className={cn(
                            "block select-none rounded-md px-4 py-2 leading-none no-underline outline-none transition-colors",
                            isHomePage && !scrolled
                              ? "text-white/90 hover:text-white hover:bg-white/10"
                              : "text-gray-700 hover:text-sky-500 hover:bg-sky-50",
                            isActive(item.href) &&
                              (isHomePage && !scrolled
                                ? "text-white font-semibold"
                                : "text-sky-500 font-semibold")
                          )}
                        >
                          {item.name}
                        </Link>
                      </NavigationMenuLink>
                    )}
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* Login/Register Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {session?.user ? (
              <div className="flex items-center space-x-3 relative">
                <button
                  ref={profileButtonRef}
                  onClick={toggleProfile}
                  className={`flex items-center space-x-2 transition-all duration-200 ${
                    isHomePage && !scrolled
                      ? "text-white bg-white/10 hover:bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/20"
                      : "bg-gradient-to-r from-sky-50 to-blue-50 hover:shadow-md px-3 py-1.5 rounded-full border border-white/40"
                  }`}
                >
                  <User className={`h-4 w-4 ${getIconColor()}`} />
                  <span
                    className={`text-sm font-medium ${
                      isHomePage && !scrolled ? "text-white" : "text-sky-600"
                    }`}
                  >
                    {session.user.full_name}
                  </span>
                  <ChevronDown
                    className={`h-4 w-4 transition-transform duration-200 ${
                      profileOpen ? "rotate-180" : ""
                    } ${
                      isHomePage && !scrolled
                        ? "text-white/80"
                        : "text-gray-500"
                    }`}
                  />
                </button>

                {/* Profile Dropdown */}
                <div
                  ref={profileRef}
                  className="absolute right-0 top-full mt-2 z-50"
                  style={{ visibility: profileOpen ? "visible" : "hidden" }}
                >
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{
                      opacity: profileOpen ? 1 : 0,
                      y: profileOpen ? 0 : 10,
                    }}
                    transition={{ duration: 0.2 }}
                    className="w-56 rounded-xl shadow-lg bg-white/90 backdrop-blur-xl border border-white/40 overflow-hidden"
                  >
                    <div className="py-2">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900">
                          {session.user.full_name}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {session.user.email}
                        </p>
                      </div>
                      <Link
                        href="/personal"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-sky-50 hover:to-blue-50 hover:text-sky-600 transition-colors duration-200"
                        onClick={() => setProfileOpen(false)}
                      >
                        <User className="h-4 w-4 mr-2" />
                        Trang cá nhân
                      </Link>
                      <Link
                        href="/personal/history"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-sky-50 hover:to-blue-50 hover:text-sky-600 transition-colors duration-200"
                        onClick={() => setProfileOpen(false)}
                      >
                        <History className="h-4 w-4 mr-2" />
                        Lịch sử học tập
                      </Link>
                      <Link
                        href="/personal/settings"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-sky-50 hover:to-blue-50 hover:text-sky-600 transition-colors duration-200"
                        onClick={() => setProfileOpen(false)}
                      >
                        <Settings className="h-4 w-4 mr-2" />
                        Cài đặt
                      </Link>
                      <div className="border-t border-gray-100 my-1"></div>
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 hover:text-red-600 transition-colors duration-200"
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Đăng xuất
                      </button>
                    </div>
                  </motion.div>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link href="/auth/login">
                  <Button
                    variant="ghost"
                    className={`rounded-full ${
                      isHomePage && !scrolled
                        ? "text-white hover:bg-white/10"
                        : "hover:bg-sky-50 text-gray-700 hover:text-sky-600"
                    }`}
                  >
                    Đăng nhập
                  </Button>
                </Link>
                <Link href="/auth/register">
                  <Button className="bg-gradient-to-r from-sky-400 to-blue-600 hover:from-sky-500 hover:to-blue-700 text-white shadow-md shadow-blue-500/20 rounded-full transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/30">
                    Đăng ký
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`p-1 rounded-full transition-colors duration-200 ${
                isHomePage && !scrolled
                  ? "text-white hover:text-white hover:bg-white/10"
                  : "text-gray-700 hover:text-sky-500 hover:bg-sky-50"
              }`}
            >
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className={`md:hidden shadow-lg ${getMobileMenuBg()}`}
        >
          <div className="container mx-auto px-4 py-4">
            <div className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <div
                  key={item.name}
                  className={`py-2 last:border-0 ${
                    isHomePage && !scrolled
                      ? "border-b border-white/10"
                      : "border-b border-gray-100"
                  }`}
                >
                  {item.dropdown ? (
                    <div>
                      <button
                        onClick={() => toggleDropdown(item.name)}
                        className={`flex items-center justify-between w-full font-medium transition-colors duration-200 ${getTextColor(
                          isDropdownActive(item.dropdown)
                        )}`}
                      >
                        {item.name}
                        <ChevronDown
                          className={`ml-1 h-4 w-4 transition-transform duration-200 ${
                            activeDropdown === item.name ? "rotate-180" : ""
                          } ${getIconColor()}`}
                        />
                      </button>
                      {activeDropdown === item.name && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.2 }}
                          className={`mt-2 pl-4 ${
                            isHomePage && !scrolled
                              ? "border-l-2 border-white/20"
                              : "border-l-2 border-sky-200"
                          }`}
                        >
                          {item.dropdown.map((dropdownItem) => (
                            <Link
                              key={dropdownItem.name}
                              href={dropdownItem.href}
                              className={`block py-2 transition-colors duration-200 ${
                                isActive(dropdownItem.href)
                                  ? isHomePage && !scrolled
                                    ? "text-white font-medium"
                                    : "text-sky-500 font-medium"
                                  : isHomePage && !scrolled
                                  ? "text-white/80 hover:text-white"
                                  : "text-gray-600 hover:text-sky-500"
                              }`}
                              onClick={() => setIsOpen(false)}
                            >
                              {dropdownItem.name}
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </div>
                  ) : (
                    <Link
                      href={item.href}
                      className={`block font-medium ${getTextColor(
                        isActive(item.href)
                      )}`}
                      onClick={() => setIsOpen(false)}
                    >
                      {item.name}
                    </Link>
                  )}
                </div>
              ))}
              <div
                className={`pt-4 flex flex-col space-y-3 border-t ${
                  isHomePage && !scrolled
                    ? "border-white/10"
                    : "border-gray-100"
                }`}
              >
                {session?.user ? (
                  <div className="flex flex-col space-y-3">
                    <div className="flex items-center justify-between bg-gradient-to-r from-sky-50 to-blue-50 px-3 py-2 rounded-lg border border-white/40">
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4 text-sky-500" />
                        <span className="text-sm font-medium text-gray-700">
                          {session.user.full_name}
                        </span>
                      </div>
                      <ChevronDown
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleProfile(e);
                        }}
                        className={`h-4 w-4 text-gray-500 transition-transform duration-200 cursor-pointer ${
                          profileOpen ? "rotate-180" : ""
                        }`}
                      />
                    </div>

                    <div
                      style={{
                        height: profileOpen ? "auto" : 0,
                        overflow: "hidden",
                      }}
                      className="transition-all duration-200"
                    >
                      <motion.div
                        initial={false}
                        animate={{ opacity: profileOpen ? 1 : 0 }}
                        transition={{ duration: 0.2 }}
                        className="flex flex-col space-y-1 pl-2"
                      >
                        <Link
                          href="/personal"
                          className="flex items-center py-2 text-sm text-gray-700 hover:text-sky-500"
                          onClick={() => {
                            setIsOpen(false);
                            setProfileOpen(false);
                          }}
                        >
                          <User className="h-4 w-4 mr-2" />
                          Trang cá nhân
                        </Link>
                        <Link
                          href="/personal/history"
                          className="flex items-center py-2 text-sm text-gray-700 hover:text-sky-500"
                          onClick={() => {
                            setIsOpen(false);
                            setProfileOpen(false);
                          }}
                        >
                          <History className="h-4 w-4 mr-2" />
                          Lịch sử học tập
                        </Link>
                        <Link
                          href="/personal/settings"
                          className="flex items-center py-2 text-sm text-gray-700 hover:text-sky-500"
                          onClick={() => {
                            setIsOpen(false);
                            setProfileOpen(false);
                          }}
                        >
                          <Settings className="h-4 w-4 mr-2" />
                          Cài đặt
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="flex items-center py-2 text-sm text-red-500 hover:text-red-600"
                        >
                          <LogOut className="h-4 w-4 mr-2" />
                          Đăng xuất
                        </button>
                      </motion.div>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col space-y-3">
                    <Link href="/auth/login" className="w-full">
                      <Button
                        variant="outline"
                        className={`w-full justify-center ${
                          isHomePage && !scrolled
                            ? "border border-white/40 text-white"
                            : "border border-gray-200 text-gray-700"
                        }`}
                      >
                        Đăng nhập
                      </Button>
                    </Link>
                    <Link href="/auth/register" className="w-full">
                      <Button className="w-full justify-center bg-gradient-to-r from-sky-400 to-blue-600 hover:from-sky-500 hover:to-blue-700 text-white shadow-md shadow-blue-500/20">
                        Đăng ký
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </nav>
  );
}
