import Link from 'next/link';
import Image from 'next/image';
import { prisma } from '../../../lib/prisma';
import Hapus from '@/components/Hapus';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const wishlists = await prisma.wishlist.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  });

  return (
    <main className="dashboard-page">
      <div className="dashboard-container">
        <header className="dashboard-header">
          <div>
            <p className="dashboard-label">KOLEKSI PRIBADI</p>
            <h1>Wishlist</h1>
            <p className="dashboard-subtitle">
              Catat hal-hal yang ingin kamu miliki.
            </p>
          </div>

          <Link className="add-link" href="/tambah">
            + Tambah Wishlist
          </Link>
        </header>

        {wishlists.length === 0 ? (
          <section className="no-wishlist">
            <h2>Belum ada wishlist</h2>
            <p>Tambahkan hal pertama yang ingin kamu simpan.</p>
            <Link href="/tambah">Tambah wishlist pertama</Link>
          </section>
        ) : (
          <section className="wishlist-grid">
            {wishlists.map((wishlist) => (
              <article className="wishlist-card" key={wishlist.id}>
                {wishlist.image && (
                  <Image
                    className="wishlist-image"
                    src={wishlist.image}
                    alt={wishlist.title}
                    width={600}
                    height={420}
                  />
                )}
                <p className="card-date">
                  {new Date(wishlist.createdAt).toLocaleDateString('id-ID')}
                </p>
                <h2>{wishlist.title}</h2>

                {wishlist.description && <p>{wishlist.description}</p>}

                {wishlist.link && (
                  <a className="product-link" href={wishlist.link} target="_blank" rel="noreferrer">
                    Lihat keinginan ↗
                  </a>
                )}

                <div className="card-buttons">
                  <Link className="edit-link" href={`/edit/${wishlist.id}`}>
                    Edit
                  </Link>
                  <Hapus id={wishlist.id} />
                </div>
              </article>
            ))}
          </section>
        )}
      </div>
    </main>
  );
}
