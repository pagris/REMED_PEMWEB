import Link from 'next/link';
import FormTambah from '@/components/FormTambah';

export default function TambahPage() {
  return (
    <main className="form-page">
      <div className="form-container">
        <Link className="back-link" href="/dashboard">← Kembali ke dashboard</Link>
        <p className="dashboard-label">TAMBAHKAN KE KOLEKSI</p>
        <h1>Wishlist baru</h1>
        <p className="dashboard-subtitle">Isi detail yang ingin kamu simpan.</p>
        <FormTambah />
      </div>
    </main>
  );
}
