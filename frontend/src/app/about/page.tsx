'use client';

import Header from '@/components/Header';
import Image from 'next/image';

export default function AboutPage() {
  return (
    <main className="min-h-screen">
      <Header />
      
      <div className="pt-32 pb-16 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-bold text-center mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-800">
            İstanbul&apos;da 13 Yıllık Teknik Servis Tecrübesi
          </h1>
          <p className="text-center text-gray-600 max-w-3xl mx-auto mb-16">
            2010 yılından beri İstanbul&apos;da profesyonel ekibimizle bilgisayar, notebook, telefon ve tablet tamiri hizmetleri sunuyoruz.
          </p>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-24">
            <div>
              <h2 className="text-2xl font-bold mb-6 text-gray-900">Hakkımızda</h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  Teknik Servis olarak, teknolojinin hayatımızdaki önemini ve cihazlarınızın sizin için değerini çok iyi biliyoruz. 
                  2010 yılında İstanbul&apos;da kurulduğumuz günden beri, bilgisayar, notebook, telefon ve tablet tamiri konusunda uzmanlaşmış ekibimizle
                  müşterilerimize en iyi hizmeti sunmak için çalışıyoruz.
                </p>
                <p>
                  Deneyimli teknisyenlerimiz, orijinal yedek parçalar ve modern ekipmanlar kullanarak, cihazlarınızı en iyi şekilde tamir ediyoruz.
                  Amacımız, müşterilerimizin memnuniyetini en üst seviyede tutarak, kaliteli ve güvenilir hizmet sunmaktır.
                </p>
              </div>
              
              <h2 className="text-2xl font-bold mt-8 mb-6 text-gray-900">Uzman Kadromuz</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-md">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-blue-600">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0V12a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 12V5.25" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold">Notebook Uzmanları</h3>
                  </div>
                  <p className="text-gray-600">Her marka notebook tamiri konusunda uzmanlaşmış teknisyenlerimiz ile hizmetinizdeyiz.</p>
                </div>
                
                <div className="bg-white p-6 rounded-xl shadow-md">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-blue-600">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold">iPhone Tamir Ekibi</h3>
                  </div>
                  <p className="text-gray-600">Apple sertifikalı teknisyenlerimiz ile iPhone ve iPad tamiriniz güvende.</p>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <Image
                src="/technical-service.webp"
                alt="Teknik Servis Ekibimiz"
                width={600}
                height={450}
                className="rounded-2xl shadow-xl"
              />
              <div className="absolute -bottom-8 -right-8 bg-white p-6 rounded-xl shadow-lg hidden md:block">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-blue-600">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Mutlu Müşteri</p>
                    <p className="text-2xl font-bold text-gray-900">10,000+</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mb-20">
            <h2 className="text-3xl font-bold text-center mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-800">
              Neden Bizi Tercih Etmelisiniz?
            </h2>
            <p className="text-center text-gray-600 max-w-3xl mx-auto mb-12">
              İstanbul&apos;da 13 yıllık teknik servis deneyimimiz, uzman kadromuz ve müşteri odaklı hizmet anlayışımızla cihazlarınızın tamirinde en iyi sonuçları elde etmeniz için çalışıyoruz.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105 border border-gray-100">
                <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7 text-blue-600">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900">13+ Yıllık Sektör Deneyimi</h3>
                <p className="text-gray-600 mb-4">
                  2010 yılından beri bilgisayar, notebook, akıllı telefon ve tablet tamiri konusunda 10.000&apos;den fazla müşteriye hizmet verdik. Uzun yıllara dayanan deneyimimiz ile en karmaşık teknik sorunları bile çözme konusunda uzmanlık kazandık.
                </p>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-center">
                    <svg className="h-5 w-5 text-blue-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    Uzmanlaşmış teknik kadro
                  </li>
                  <li className="flex items-center">
                    <svg className="h-5 w-5 text-blue-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    Güvenilir tamir hizmeti
                  </li>
                  <li className="flex items-center">
                    <svg className="h-5 w-5 text-blue-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    Sektörde lider konum
                  </li>
                </ul>
              </div>
              
              <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105 border border-gray-100">
                <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7 text-green-600">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900">Hızlı ve Etkili Tamir</h3>
                <p className="text-gray-600 mb-4">
                  Zamanın değerli olduğunu biliyoruz. İş akışımızı optimize ederek çoğu tamiri aynı gün içinde tamamlıyoruz. Hızlı servisimiz, verimli çalışma süreçlerimiz ve geniş yedek parça envanterimiz sayesinde cihazınızı kısa sürede size teslim ediyoruz.
                </p>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-center">
                    <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    Aynı gün tamir hizmeti
                  </li>
                  <li className="flex items-center">
                    <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    Profesyonel teşhis ekipmanları
                  </li>
                  <li className="flex items-center">
                    <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    Hemen tespit ve çözüm
                  </li>
                </ul>
              </div>
              
              <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105 border border-gray-100">
                <div className="w-14 h-14 bg-purple-100 rounded-full flex items-center justify-center mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7 text-purple-600">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                  </svg>
                </div>
                 <h3 className="text-xl font-semibold mb-3 text-gray-900">Tüm Cihazlar İçin Garantili Onarım</h3> 
                <p className="text-gray-600 mb-4">
                  Yaptığımız tüm tamir işlemleri garantilidir. iPhone, Samsung, Huawei, Xiaomi, Oppo ve diğer tüm akıllı telefon markalarına destek veriyoruz. Orijinal ve yüksek kaliteli yedek parçalar kullanarak, tamirini yaptığımız cihazların uzun ömürlü olmasını sağlıyoruz.
                </p>*
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-center">
                    <svg className="h-5 w-5 text-purple-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    Tüm akıllı telefon markaları
                  </li>
                  <li className="flex items-center">
                    <svg className="h-5 w-5 text-purple-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    Orijinal parça garantisi
                  </li>
                  <li className="flex items-center">
                    <svg className="h-5 w-5 text-purple-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    30 gün tamir garantisi
                  </li>
                </ul>
              </div>
              
              <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105 border border-gray-100">
                <div className="w-14 h-14 bg-amber-100 rounded-full flex items-center justify-center mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7 text-amber-600">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900">Uygun ve Şeffaf Fiyatlar</h3>
                <p className="text-gray-600 mb-4">
                  Kaliteli teknik servis hizmetini uygun fiyatlarla sunuyoruz. Her türlü notebook, bilgisayar ve akıllı telefon tamiriniz için önce ücretsiz detaylı arıza tespiti yapıyor, sonra net fiyat bilgisi veriyoruz. Müşterilerimize gizli ücret veya beklenmedik maliyetler çıkarmıyoruz.
                </p>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-center">
                    <svg className="h-5 w-5 text-amber-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    Ücretsiz arıza tespiti ve fiyat teklifi
                  </li>
                  <li className="flex items-center">
                    <svg className="h-5 w-5 text-amber-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    Rekabetçi fiyat politikası
                  </li>
                  <li className="flex items-center">
                    <svg className="h-5 w-5 text-amber-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    Gizli maliyet yok
                  </li>
                </ul>
              </div>
              
              <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105 border border-gray-100">
                <div className="w-14 h-14 bg-indigo-100 rounded-full flex items-center justify-center mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7 text-indigo-600">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900">Sertifikalı Uzman Kadro</h3>
                <p className="text-gray-600 mb-4">
                  Teknik servis ekibimiz, Apple, Samsung, Huawei gibi sektörün önde gelen markalarından sertifikalar almış profesyonellerden oluşmaktadır. Düzenli eğitimlerle güncel teknolojilere hâkim olan teknisyenlerimiz, en karmaşık notebook ve akıllı telefon tamiri işlemlerini başarıyla gerçekleştirmektedir.
                </p>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-center">
                    <svg className="h-5 w-5 text-indigo-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    Marka sertifikalı teknisyenler
                  </li>
                  <li className="flex items-center">
                    <svg className="h-5 w-5 text-indigo-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    Sürekli teknik eğitim
                  </li>
                  <li className="flex items-center">
                    <svg className="h-5 w-5 text-indigo-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    Uzman arıza teşhis yeteneği
                  </li>
                </ul>
              </div>
              
              <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105 border border-gray-100">
                <div className="w-14 h-14 bg-teal-100 rounded-full flex items-center justify-center mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7 text-teal-600">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900">7/24 Teknik Destek</h3>
                <p className="text-gray-600 mb-4">
                  Sadece cihaz tamiri değil, aynı zamanda cihazlarınızın optimum performansı için kullanım tavsiyeleri ve bakım önerileri de sunuyoruz. Notebook, bilgisayar ve her marka akıllı telefonla ilgili tüm sorularınızda WhatsApp üzerinden 7/24 ücretsiz teknik danışmanlık hizmeti veriyoruz.
                </p>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-center">
                    <svg className="h-5 w-5 text-teal-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    7/24 WhatsApp destek hattı
                  </li>
                  <li className="flex items-center">
                    <svg className="h-5 w-5 text-teal-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    Uzaktan teknik yardım
                  </li>
                  <li className="flex items-center">
                    <svg className="h-5 w-5 text-teal-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    Tamir sonrası kullanım desteği
                  </li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="bg-blue-50 p-8 rounded-2xl">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-2xl font-bold mb-6 text-gray-900">Misyonumuz ve Vizyonumuz</h2>
              <div className="space-y-6 text-gray-600">
                <p>
                  <strong className="text-blue-600">Misyonumuz:</strong> Müşterilerimize en kaliteli teknik servis hizmetini sunarak, cihazlarının ömrünü uzatmak ve problemlerini en hızlı şekilde çözmektir.
                </p>
                <p>
                  <strong className="text-blue-600">Vizyonumuz:</strong> Teknoloji sektöründe güvenilir ve tercih edilen bir teknik servis olmak, müşterilerimize her zaman en iyi hizmeti sunmak ve sektörde öncü olmaktır.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}