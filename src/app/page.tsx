export default function HomePage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 text-center">
        <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6">
          Akselerasi Omzet Bisnis Properti Anda <br />
          <span className="text-accent">Secara Digital.</span>
        </h1>
        <p className="text-textSoft max-w-2xl mx-auto text-lg mb-10">
          Kami membantu pengembang dan pemilik properti di Yogyakarta untuk
          mendapatkan leads berkualitas melalui strategi digital marketing yang
          terukur dan efisien.
        </p>
        <div className="flex justify-center gap-4">
          <button className="bg-accent text-white px-8 py-4 rounded-xl font-bold shadow-lg shadow-red-600/20">
            Konsultasi Jasa
          </button>
          <button className="bg-white/5 border border-white/10 text-white px-8 py-4 rounded-xl font-bold">
            Lihat Listing
          </button>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-primarySoft/10">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white">
              Layanan Strategis Kami
            </h2>
            <p className="text-textSoft mt-2">
              Solusi end-to-end untuk menaikkan omzet penjualan Anda.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 rounded-3xl bg-primarySoft/30 border border-white/5">
              <div className="w-12 h-12 bg-accent/20 rounded-2xl flex items-center justify-center mb-6 text-accent font-bold">
                01
              </div>
              <h3 className="text-xl font-bold text-white mb-4">
                Meta Ads Properti
              </h3>
              <p className="text-textSoft text-sm leading-relaxed">
                Jangkau calon pembeli potensial secara spesifik berdasarkan
                minat, lokasi, dan daya beli melalui iklan Facebook & Instagram
                yang tertarget.
              </p>
            </div>
            <div className="p-8 rounded-3xl bg-primarySoft/30 border border-white/5">
              <div className="w-12 h-12 bg-accent/20 rounded-2xl flex items-center justify-center mb-6 text-accent font-bold">
                02
              </div>
              <h3 className="text-xl font-bold text-white mb-4">
                Optimasi SEO & Listing
              </h3>
              <p className="text-textSoft text-sm leading-relaxed">
                Pastikan properti Anda muncul di halaman pertama mesin pencari
                saat calon pembeli mencari hunian impian mereka di Yogyakarta.
              </p>
            </div>
            <div className="p-8 rounded-3xl bg-primarySoft/30 border border-white/5">
              <div className="w-12 h-12 bg-accent/20 rounded-2xl flex items-center justify-center mb-6 text-accent font-bold">
                03
              </div>
              <h3 className="text-xl font-bold text-white mb-4">
                Manajemen Leads CRM
              </h3>
              <p className="text-textSoft text-sm leading-relaxed">
                Sistem pengelolaan data calon pembeli (Leads) yang rapi untuk
                memastikan setiap peluang ter-follow up hingga terjadi closing.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
