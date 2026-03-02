export const metadata = {
  title: "OmzetNaik.id | Agensi Digital Marketing & Portal Properti Yogyakarta",
  description:
    "Scale up penjualan properti Anda dengan strategi Meta Ads dan SEO terbaik di Jogja.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className="bg-primary text-white">
        <nav className="fixed w-full z-50 bg-primary/80 backdrop-blur-md py-5 border-b border-white/5 px-6 flex justify-between items-center">
          <div className="text-xl font-bold tracking-tighter">
            OMZETNAIK<span className="text-accent">.ID</span>
          </div>
          <div className="hidden md:flex gap-8 text-sm font-medium">
            <a href="/" className="hover:text-accent">
              Beranda
            </a>
            <a href="/properties" className="hover:text-accent">
              Properti
            </a>
            <a href="/services" className="hover:text-accent">
              Layanan
            </a>
          </div>
          <button className="bg-accent text-white px-5 py-2 rounded-lg text-sm font-bold">
            Konsultasi Gratis
          </button>
        </nav>
        <main>{children}</main>
      </body>
    </html>
  );
}
