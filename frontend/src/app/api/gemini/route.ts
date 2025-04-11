import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    // Return Gemini API configuration
    // NOTE: This should be restricted in a production environment
    return NextResponse.json({
      hasKey: process.env.GEMINI_API_KEY ? true : false,
    });
  } catch (error) {
    console.error("Error getting Gemini API config:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
