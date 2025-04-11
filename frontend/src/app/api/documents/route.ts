import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { promisify } from 'util';
import { createDocumentSlug } from '@/utils';

const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);

const DOCUMENTS_DIR = path.join(process.cwd(), 'src/data/documents');

export async function GET() {
  try {
    const files = await readdir(DOCUMENTS_DIR);
    
    const docxFiles = files.filter(file => file.endsWith('.docx'));
    
    const documentsPromises = docxFiles.map(async (filename) => {
      const filePath = path.join(DOCUMENTS_DIR, filename);
      const fileStat = await stat(filePath);
      
      // Tạo ID từ tên file sử dụng slugify
      const title = filename.replace(/\.docx$/, '');
      const id = createDocumentSlug(title);
      
      return {
        id,
        title,
        filename,
        size: fileStat.size,
        updatedAt: fileStat.mtime
      };
    });
    
    const documents = await Promise.all(documentsPromises);
    
    // Sắp xếp theo thời gian cập nhật mới nhất
    const sortedDocuments = documents.sort((a, b) => 
      new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
    
    return NextResponse.json(sortedDocuments);
  } catch (error) {
    console.error('Error getting documents:', error);
    return NextResponse.json({ error: 'Failed to get documents' }, { status: 500 });
  }
} 