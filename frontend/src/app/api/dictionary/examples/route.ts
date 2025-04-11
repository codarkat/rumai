import { NextRequest, NextResponse } from 'next/server';
import { dictionaryService } from '@/services/ai';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const wordsParam = searchParams.get('words') || '';
  const meaning = searchParams.get('meaning') || '';
  const limitParam = searchParams.get('limit');
  const limit = limitParam ? parseInt(limitParam, 10) : undefined;

  if (!wordsParam.trim()) {
    return NextResponse.json({
      success: false,
      error: 'Danh sách từ không được để trống',
    }, { status: 400 });
  }

  try {
    // Phân tách chuỗi thành mảng các từ
    let words = wordsParam.split(',').map(word => word.trim()).filter(word => word.length > 0);
    
    if (words.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'Không có từ hợp lệ trong danh sách',
      }, { status: 400 });
    }
    
    // Giới hạn số từ nếu có yêu cầu
    if (limit && limit > 0 && limit < words.length) {
      words = words.slice(0, limit);
    }
    
    // Gọi dictionary service để tạo các câu ví dụ
    const examples = await dictionaryService.generateExamples(words, meaning);
    
    return NextResponse.json({
      success: true,
      data: examples,
    });
  } catch (error) {
    console.error('Lỗi khi tạo câu ví dụ:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'Đã xảy ra lỗi khi tạo câu ví dụ',
      },
      { status: 500 }
    );
  }
}