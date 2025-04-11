"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { DictionaryType } from "@/services/dictionary.service";

interface DictionarySwitchProps {
  dictionaryType: DictionaryType;
}

export default function DictionarySwitch({
  dictionaryType,
}: DictionarySwitchProps) {
  return (
    <div className="relative bg-gray-200 rounded-full p-1 flex">
      <Link
        href="/dictionary/vi-ru"
        className={`relative z-10 px-6 py-2 rounded-full transition-all duration-300 ${
          dictionaryType === "vi-ru"
            ? "text-white font-medium"
            : "text-gray-400 hover:text-gray-600"
        }`}
      >
        Việt - Nga
      </Link>
      <Link
        href="/dictionary/ru-vi"
        className={`relative z-10 px-6 py-2 rounded-full transition-all duration-300 ${
          dictionaryType === "ru-vi"
            ? "text-white font-medium"
            : "text-gray-400 hover:text-gray-600"
        }`}
      >
        Nga - Việt
      </Link>
      {/* Indicator background with blue gradient */}
      <motion.div
        className="absolute top-1 bottom-1 rounded-full bg-gradient-to-r from-sky-500 to-blue-600"
        initial={false}
        animate={{
          left: dictionaryType === "vi-ru" ? "0.25rem" : "calc(50% + 0.25rem)",
          width: "calc(50% - 0.5rem)",
          x: 0,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      />
    </div>
  );
}
