import { NextRequest, NextResponse } from "next/server";
import { DictionaryType, DictionaryServiceFactory } from "@/services/dictionary.service";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const dictType = (searchParams.get("dict") || "vi-ru") as DictionaryType;

    const dictionary = DictionaryServiceFactory.getDictionary(dictType);
    await dictionary.loadDictionary();

    return NextResponse.json({
      success: true,
      data: {
        wordCount: dictionary.getWordCount(),
        info: dictionary.getInfo(),
        dictionaryType: dictionary.getDictionaryType(),
      },
    });
  } catch (error) {
    console.error("Lỗi khi lấy thông tin từ điển:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Đã xảy ra lỗi khi lấy thông tin từ điển",
      },
      { status: 500 }
    );
  }
}
