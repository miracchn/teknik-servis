export default function Services() {
  const services = [
    {
      title: "Notebook Tamiri",
      description: "Her marka notebook tamirini yapmaktayız. Fiyat ve arıza bilgisi verildikten sonra tamir işlemine başlanır."
    },
    {
      title: "Bilgisayar Tamiri",
      description: "Tüm masaüstü bilgisayarlarınız bakım onarımlarını yapıyoruz."
    },
    {
      title: "iPhone Tamir Servisi",
      description: "Kırılan veya çatlayan iPhone ekranlarını aynı gün tamir ediyoruz."
    },
    {
      title: "iPad Tamir Servisi",
      description: "iPad tamiri konusunda diğer apple ürünlerinde olduğu gibi kaliteli ve ekonomik iPad tamir hizmeti ile yanınızdayız."
    }
  ];

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-foreground mb-4">Hizmetlerimiz</h2>
          <p className="text-lg text-muted-foreground">
            13 yıldır Bilgisayar, Telefon, Tablet ve Notebook tamiri yapıyoruz.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className="group bg-card/50 backdrop-blur-sm rounded-lg p-6 transition-all duration-200 hover:translate-y-[-2px] border-r border-b border-border/5"
              style={{
                boxShadow: '0 2px 4px rgba(0,0,0,0.02), 0 1px 2px rgba(0,0,0,0.03)'
              }}
            >
              <div className="mb-4 w-12 h-12 rounded-full bg-primary/5 flex items-center justify-center text-xl font-bold text-primary">
                {index + 1}
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">{service.title}</h3>
              <p className="text-muted-foreground">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 