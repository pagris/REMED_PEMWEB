'use client';

import { useState } from 'react';
import { deleteWishlist } from '@/actions/wishlist';

export default function Hapus({ id }) {
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();

    const yakin = window.confirm('Yakin ingin menghapus wishlist ini?');
    if (!yakin) return;

    setLoading(true);

    try {
      const formData = new FormData(event.currentTarget);
      await deleteWishlist(formData);
    } catch (error) {
      if (error?.digest?.startsWith('NEXT_REDIRECT')) return;
      window.alert(error.message || 'Gagal menghapus wishlist.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input type="hidden" name="id" value={id} />
      <button type="submit" className="delete-button" disabled={loading}>
        {loading ? 'Menghapus...' : 'Hapus'}
      </button>
    </form>
  );
}
