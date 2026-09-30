import { mkdir, unlink, writeFile } from 'node:fs/promises';
import path from 'node:path';

const imageTypes = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
};

export async function saveWishlistImage(file) {
  const extension = imageTypes[file.type];

  if (!extension) {
    throw new Error('Gunakan gambar JPG, PNG, atau WEBP.');
  }

  if (file.size > 5 * 1024 * 1024) {
    throw new Error('Ukuran gambar maksimal 5 MB.');
  }

  const uploadFolder = path.join(process.cwd(), 'public', 'uploads');
  await mkdir(uploadFolder, { recursive: true });

  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${extension}`;
  const filePath = path.join(uploadFolder, fileName);
  const fileBuffer = Buffer.from(await file.arrayBuffer());

  await writeFile(filePath, fileBuffer);
  return `/uploads/${fileName}`;
}

export async function deleteWishlistImage(imageUrl) {
  if (!imageUrl || !imageUrl.startsWith('/uploads/')) return;

  const fileName = path.basename(imageUrl);
  const filePath = path.join(process.cwd(), 'public', 'uploads', fileName);

  try {
    await unlink(filePath);
  } catch {
    // Kalau file-nya sudah tidak ada, tidak perlu melakukan apa-apa.
  }
}
