'use client';

import { useState } from 'react';
import { createWishlist } from '@/actions/wishlist';

export default function FormTambah() {
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData(event.currentTarget);
      await createWishlist(formData);
    } catch (error) {
      if (error?.digest?.startsWith('NEXT_REDIRECT')) return;
      window.alert(error.message || 'Gagal menambahkan wishlist.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="simple-form" onSubmit={handleSubmit}>
      <label htmlFor="title">Judul wishlist</label>
      <input
        id="title"
        name="title"
        type="text"
        placeholder="Contoh: Sepatu lari"
        required
      />

      <label htmlFor="description">Catatan</label>
      <textarea
        id="description"
        name="description"
        rows={4}
        placeholder="Tambahkan catatan (boleh dikosongkan)"
      />

      <label htmlFor="link">Link produk</label>
      <input
        id="link"
        name="link"
        type="url"
        placeholder="https://"
      />

      <label htmlFor="image">Gambar produk (opsional)</label>
      <input
        id="image"
        name="image"
        type="file"
        accept="image/png,image/jpeg,image/webp"
      />

      <button type="submit" disabled={loading}>
        {loading ? 'Menyimpan...' : 'Tambah Wishlist'}
      </button>
    </form>
  );
}
