import { NextRequest, NextResponse } from "next/server";
import { DictionaryType, DictionaryServiceFactory } from "@/services/dictionary.service";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q") || "";
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const dictType = (searchParams.get("dict") || "vi-ru") as DictionaryType;
    
    if (!query) {
      return NextResponse.json({
        success: false,
        error: "Thiếu từ khóa tìm kiếm",
      });
    }

    const dictionary = DictionaryServiceFactory.getDictionary(dictType);
    await dictionary.loadDictionary();
    
    const suggestions = await dictionary.getSuggestions(query, limit);

    return NextResponse.json({
      success: true,
      query,
      dictionary: dictType,
      count: suggestions.length,
      results: suggestions,
    });
  } catch (error) {
    console.error("Lỗi khi lấy gợi ý từ điển:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Đã xảy ra lỗi khi lấy gợi ý từ điển",
      },
      { status: 500 }
    );
  }
}
