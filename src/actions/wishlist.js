'use server';

import { prisma } from '../../lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { deleteWishlistImage, saveWishlistImage } from '@/lib/wishlist-image';

function getWishlistData(formData) {
  const title = String(formData.get('title') || '').trim();
  const description = String(formData.get('description') || '').trim();
  const link = String(formData.get('link') || '').trim();

  if (!title) {
    throw new Error('Judul wishlist wajib diisi.');
  }

  return {
    title,
    description: description || null,
    link: link || null,
  };
}

export async function createWishlist(formData) {
  const imageFile = formData.get('image');
  let image = null;

  if (imageFile instanceof File && imageFile.size > 0) {
    image = await saveWishlistImage(imageFile);
  }

  await prisma.wishlist.create({
    data: { ...getWishlistData(formData), image },
  });

  revalidatePath('/dashboard');
  redirect('/dashboard');
}

export async function updateWishlist(formData) {
  const id = String(formData.get('id') || '');

  if (!id) {
    throw new Error('ID wishlist tidak ditemukan.');
  }

  const wishlist = await prisma.wishlist.findUnique({ where: { id } });
  if (!wishlist) throw new Error('Wishlist tidak ditemukan.');

  const imageFile = formData.get('image');
  let image = wishlist.image;

  if (imageFile instanceof File && imageFile.size > 0) {
    image = await saveWishlistImage(imageFile);
  }

  await prisma.wishlist.update({
    where: { id },
    data: { ...getWishlistData(formData), image },
  });

  if (image !== wishlist.image) {
    await deleteWishlistImage(wishlist.image);
  }

  revalidatePath('/dashboard');
  redirect('/dashboard');
}

export async function deleteWishlist(formData) {
  const id = String(formData.get('id') || '');

  if (!id) {
    throw new Error('ID wishlist tidak ditemukan.');
  }

  const wishlist = await prisma.wishlist.findUnique({ where: { id } });
  if (!wishlist) throw new Error('Wishlist tidak ditemukan.');

  await prisma.wishlist.delete({
    where: { id },
  });

  await deleteWishlistImage(wishlist.image);

  revalidatePath('/dashboard');
  redirect('/dashboard');
}
