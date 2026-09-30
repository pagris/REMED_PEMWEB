import Link from 'next/link';
import { notFound } from 'next/navigation';
import { prisma } from '../../../../lib/prisma';
import FormEdit from '@/components/FormEdit';

export default async function EditPage({ params }) {
  const { id } = await params;
  const wishlist = await prisma.wishlist.findUnique({ where: { id } });

  if (!wishlist) notFound();

  return (
    <main className="form-page">
      <div className="form-container">
        <Link className="back-link" href="/dashboard">← Kembali ke dashboard</Link>
        <p className="dashboard-label">PERBARUI KOLEKSI</p>
        <h1>Edit Wishlist</h1>
        <FormEdit wishlist={wishlist} />
      </div>
    </main>
  );
}
