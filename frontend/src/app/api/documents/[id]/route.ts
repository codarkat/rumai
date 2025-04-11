import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { promisify } from 'util';
import mammoth from 'mammoth';
import { createDocumentSlug } from '@/utils';

const readdir = promisify(fs.readdir);
const readFile = promisify(fs.readFile);
const stat = promisify(fs.stat);

const DOCUMENTS_DIR = path.join(process.cwd(), 'src/data/documents');

export async function GET(
  request: NextRequest,
  { params } : { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // Đọc danh sách file
    const files = await readdir(DOCUMENTS_DIR);
    const docxFiles = files.filter(file => file.endsWith('.docx'));
    
    // Tìm file phù hợp với ID sử dụng slugify
    const filename = docxFiles.find(file => {
      const title = file.replace(/\.docx$/, '');
      const fileId = createDocumentSlug(title);
      return fileId === id;
    });
    
    if (!filename) {
      return NextResponse.json(
        { error: 'Document not found' },
        { status: 404 }
      );
    }
    
    const filePath = path.join(DOCUMENTS_DIR, filename);
    const buffer = await readFile(filePath);
    
    // Cấu hình chuyển đổi DOCX sang HTML với các tùy chọn nâng cao
    const options = {
      buffer,
      styleMap: [
        "p[style-name='Heading 1'] => h1:fresh",
        "p[style-name='Heading 2'] => h2:fresh",
        "p[style-name='Heading 3'] => h3:fresh",
        "p[style-name='heading 1'] => h1:fresh",
        "p[style-name='heading 2'] => h2:fresh",
        "p[style-name='heading 3'] => h3:fresh",
        "r[style-name='Strong'] => strong",
        "r[style-name='Emphasis'] => em",
        "table => table",
        "tr => tr",
        "td => td",
        "p[style-name='List Paragraph'] => li:fresh"
      ],
      ignoreEmptyParagraphs: true,
      preserveEmptyParagraphs: false
    };
    
    const result = await mammoth.convertToHtml(options);
    const htmlContent = result.value;
    
    // Tạo tiêu đề từ tên file
    const title = filename.replace(/\.docx$/, '');
    
    return NextResponse.json({
      id,
      title,
      content: htmlContent
    });
  } catch (error) {
    console.error('Error getting document by ID:', error);
    return NextResponse.json(
      { error: 'Failed to get document' },
      { status: 500 }
    );
  }
} 