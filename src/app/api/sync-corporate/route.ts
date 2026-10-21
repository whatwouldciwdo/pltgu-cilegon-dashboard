import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const res = await fetch('https://aplikasi.plnindonesiapower.co.id/app/', {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch: ${res.statusText}`);
    }

    const html = await res.text();

    // Regex per card block secara strict agar tidak ada mismatch antar atribut
    const cardBlocks = [...html.matchAll(/<div class="app-card"\s+data-app-name="([^"]+)">([\s\S]*?)<\/div>\s*<\/a>\s*<\/div>/g)];

    const results = cardBlocks.map((block) => {
      const fallbackName = block[1];
      const content = block[2];

      const hrefMatch = content.match(/href="([^"]+)"/);
      const imgMatch = content.match(/<img[^>]+src="([^"]+)"/);
      const titleMatch = content.match(/<h3 class="app-title">([^<]+)<\/h3>/);
      const clickMatch = content.match(/<span class="click-count">([^<]+)<\/span>/);

      return {
        name: titleMatch ? titleMatch[1].trim() : fallbackName.toUpperCase(),
        href: hrefMatch ? hrefMatch[1] : '',
        icon: imgMatch ? imgMatch[1] : '',
        category: 'korporat',
      };
    });

    if (results.length > 0) {
      const filePath = path.join(process.cwd(), 'src', 'data', 'apps-korporat.json');
      fs.writeFileSync(filePath, JSON.stringify(results, null, 2), 'utf-8');
    }

    return NextResponse.json({
      success: true,
      total: results.length,
      data: results,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}
