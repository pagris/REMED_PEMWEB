'use client';

import { useState } from 'react';
import Image from 'next/image';
import { updateWishlist } from '@/actions/wishlist';

export default function FormEdit({ wishlist }) {
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(wishlist.image);

  function handleImageChange(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result);
    reader.readAsDataURL(file);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData(event.currentTarget);
      await updateWishlist(formData);
    } catch (error) {
      if (error?.digest?.startsWith('NEXT_REDIRECT')) return;
      window.alert(error.message || 'Gagal mengubah wishlist.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="simple-form" onSubmit={handleSubmit}>
      <input type="hidden" name="id" value={wishlist.id} />

      <label htmlFor="title">Judul wishlist</label>
      <input
        id="title"
        name="title"
        type="text"
        defaultValue={wishlist.title}
        required
      />

      <label htmlFor="description">Catatan</label>
      <textarea
        id="description"
        name="description"
        rows={4}
        defaultValue={wishlist.description || ''}
      />

      <label htmlFor="link">Link produk</label>
      <input
        id="link"
        name="link"
        type="url"
        defaultValue={wishlist.link || ''}
      />

      <label htmlFor="image">Ganti gambar (opsional)</label>
      {preview && (
        <Image
          className="edit-image-preview"
          src={preview}
          alt="Preview gambar wishlist"
          width={600}
          height={400}
          unoptimized
        />
      )}
      <input
        id="image"
        name="image"
        type="file"
        accept="image/png,image/jpeg,image/webp"
        onChange={handleImageChange}
      />

      <button type="submit" disabled={loading}>
        {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
      </button>
    </form>
  );
}
