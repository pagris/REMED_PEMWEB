import { NextResponse } from 'next/server';
import { prisma } from '../../../../../lib/prisma';
import { deleteWishlistImage } from '@/lib/wishlist-image';

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: RouteContext) {
  try {
    const { id } = await params;
    const item = await prisma.wishlist.findUnique({ where: { id } });
    if (!item) return NextResponse.json({ error: 'Wishlist tidak ditemukan.' }, { status: 404 });
    return NextResponse.json({ data: item });
  } catch {
    return NextResponse.json({ error: 'Gagal mengambil wishlist.' }, { status: 500 });
  }
}

export async function PATCH(request: Request, { params }: RouteContext) {
  try {
    const { id } = await params;
    const body = await request.json();
    const title = typeof body.title === 'string' ? body.title.trim() : '';
    if (!title) return NextResponse.json({ error: 'Judul wajib diisi.' }, { status: 400 });
    const item = await prisma.wishlist.update({
      where: { id },
      data: { title, description: body.description || null, link: body.link || null },
    });
    return NextResponse.json({ data: item });
  } catch {
    return NextResponse.json({ error: 'Gagal memperbarui wishlist.' }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: RouteContext) {
  try {
    const { id } = await params;
    const wishlist = await prisma.wishlist.findUnique({ where: { id } });
    if (!wishlist) {
      return NextResponse.json({ error: 'Wishlist tidak ditemukan.' }, { status: 404 });
    }

    await prisma.wishlist.delete({ where: { id } });
    await deleteWishlistImage(wishlist.image);
    return NextResponse.json({ message: 'Wishlist berhasil dihapus.' });
  } catch {
    return NextResponse.json({ error: 'Gagal menghapus wishlist.' }, { status: 500 });
  }
}
