import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

export async function GET() {
  try {
    const items = await prisma.wishlist.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json({ data: items });
  } catch {
    return NextResponse.json({ error: 'Gagal mengambil data wishlist.' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const title = typeof body.title === 'string' ? body.title.trim() : '';
    if (!title) return NextResponse.json({ error: 'Judul wajib diisi.' }, { status: 400 });
    const item = await prisma.wishlist.create({
      data: {
        title,
        description: body.description || null,
        link: body.link || null,
      },
    });
    return NextResponse.json({ data: item }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Gagal menyimpan wishlist.' }, { status: 500 });
  }
}
