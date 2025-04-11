import { NextRequest, NextResponse } from "next/server";
import { DictionaryType, DictionaryServiceFactory } from "@/services/dictionary.service";

export async function GET(request: NextRequest) {
  try {
    // Get search query and dictionary type
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q") || "";
    const sort = searchParams.get("sort") || "relevance";
    const dictType = (searchParams.get("dict") || "vi-ru") as DictionaryType;

    if (!query) {
      return NextResponse.json({
        success: false,
        error: "Thiếu từ khóa tìm kiếm",
      });
    }

    // Get dictionary
    const dictionary = DictionaryServiceFactory.getDictionary(dictType);
    await dictionary.loadDictionary();

    // Search
    const results = await dictionary.search(query, sort as 'relevance' | 'alphabetical');

    // Return results
    return NextResponse.json({
      success: true,
      query,
      dictionary: dictType,
      count: results.length,
      results,
    });
  } catch (error) {
    console.error("Lỗi khi tìm kiếm từ điển:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Đã xảy ra lỗi khi tìm kiếm từ điển",
      },
      { status: 500 }
    );
  }
}
