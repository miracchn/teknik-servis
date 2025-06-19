'use client';

import Header from '@/components/Header';
import Image from 'next/image';

export default function ServicesPage() {
  return (
    <main className="min-h-screen">
      <Header />
      
      <div className="pt-32 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-bold text-center mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-800">
            Teknik Servis Hizmetlerimiz
          </h1>
          <p className="text-center text-gray-600 max-w-3xl mx-auto mb-16">
            İstanbul&apos;da bilgisayar, notebook, akıllı telefon ve tablet tamir hizmetlerimiz ile cihazlarınızı en kısa sürede güvenilir şekilde çalışır hale getiriyoruz.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
            {/* Service Cards */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-105 border border-gray-100">
              <div className="h-48 bg-blue-600 relative overflow-hidden">
                <Image
                  src="/services/notebook.webp"
                  alt="Notebook Tamir Servisi"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2 text-gray-900">Notebook Tamiri</h3>
                <p className="text-gray-600 mb-4">
                  HP, Asus, Lenovo, Dell, Apple MacBook dahil her marka ve model notebook tamiri yapıyoruz. Donanım sorunları, yazılım arızaları, veri kurtarma ve parça değişimi hizmetleri sunuyoruz.
                </p>
                <ul className="space-y-2 text-gray-700 mb-4">
                  <li className="flex items-center">
                    <svg className="h-5 w-5 text-blue-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    Ekran değişimi
                  </li>
                  <li className="flex items-center">
                    <svg className="h-5 w-5 text-blue-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    Anakart tamiri
                  </li>
                  <li className="flex items-center">
                    <svg className="h-5 w-5 text-blue-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    Veri kurtarma
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-105 border border-gray-100">
              <div className="h-48 bg-green-600 relative overflow-hidden">
                <Image
                  src="/services/computer.webp"
                  alt="Bilgisayar Tamir Servisi"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2 text-gray-900">Bilgisayar Tamiri</h3>
                <p className="text-gray-600 mb-4">
                  Masaüstü bilgisayarlarınız için donanım ve yazılım sorunlarını çözüyor, parça değişimi ve periyodik bakım hizmeti sunuyoruz. Hızlı ve güvenilir çözümlerle bilgisayarınızı yeniden hayata döndürüyoruz.
                </p>
                <ul className="space-y-2 text-gray-700 mb-4">
                  <li className="flex items-center">
                    <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    Donanım değişimi ve yükseltme
                  </li>
                  <li className="flex items-center">
                    <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    İşletim sistemi kurulumu
                  </li>
                  <li className="flex items-center">
                    <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    Periyodik bakım
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-105 border border-gray-100">
              <div className="h-48 bg-purple-600 relative overflow-hidden">
                <Image
                  src="/services/smartphone.webp"
                  alt="Akıllı Telefon Tamir Servisi"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2 text-gray-900">Akıllı Telefon Tamiri</h3>
                <p className="text-gray-600 mb-4">
                  iPhone, Samsung, Huawei, Xiaomi, Oppo, Realme ve diğer tüm akıllı telefon modellerinin ekran değişimi, batarya değişimi ve yazılım sorunlarını profesyonel ekipmanlarla çözüyoruz.
                </p>
                <ul className="space-y-2 text-gray-700 mb-4">
                  <li className="flex items-center">
                    <svg className="h-5 w-5 text-purple-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    Ekran değişimi
                  </li>
                  <li className="flex items-center">
                    <svg className="h-5 w-5 text-purple-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    Batarya değişimi
                  </li>
                  <li className="flex items-center">
                    <svg className="h-5 w-5 text-purple-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    Yazılım sorunları
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-105 border border-gray-100">
              <div className="h-48 bg-red-600 relative overflow-hidden">
                <Image
                  src="/services/tablet.webp"
                  alt="Tablet Tamir Servisi"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2 text-gray-900">Tablet Tamiri</h3>
                <p className="text-gray-600 mb-4">
                  iPad, Samsung Galaxy Tab, Huawei MatePad ve diğer tüm tablet modellerinin ekran değişimi, batarya değişimi ve diğer sorunlarınız için profesyonel çözümler sunuyoruz.
                </p>
                <ul className="space-y-2 text-gray-700 mb-4">
                  <li className="flex items-center">
                    <svg className="h-5 w-5 text-red-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    Ekran değişimi
                  </li>
                  <li className="flex items-center">
                    <svg className="h-5 w-5 text-red-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    Batarya değişimi
                  </li>
                  <li className="flex items-center">
                    <svg className="h-5 w-5 text-red-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    Düğme ve dokunmatik sorunları
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-105 border border-gray-100">
              <div className="h-48 bg-yellow-600 relative overflow-hidden">
                <Image
                  src="/services/data_recovery.webp"
                  alt="Veri Kurtarma"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2 text-gray-900">Veri Kurtarma</h3>
                <p className="text-gray-600 mb-4">
                  HDD, SSD, USB bellek ve hafıza kartlarından silinen veya kaybolan verilerinizi kurtarıyoruz. Profesyonel veri kurtarma araçlarımızla önemli verilerinizi güvenle geri kazandırıyoruz.
                </p>
                <ul className="space-y-2 text-gray-700 mb-4">
                  <li className="flex items-center">
                    <svg className="h-5 w-5 text-yellow-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    HDD/SSD veri kurtarma
                  </li>
                  <li className="flex items-center">
                    <svg className="h-5 w-5 text-yellow-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    Akıllı telefon veri kurtarma
                  </li>
                  <li className="flex items-center">
                    <svg className="h-5 w-5 text-yellow-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    USB ve SD kart kurtarma
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-105 border border-gray-100">
              <div className="h-48 bg-indigo-600 relative overflow-hidden">
                <Image
                  src="/services/software.webp"
                  alt="Yazılım Hizmetleri"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2 text-gray-900">Yazılım Hizmetleri</h3>
                <p className="text-gray-600 mb-4">
                  Windows, macOS, Android ve iOS işletim sistemleri için yazılım sorunlarını çözüyor, virüs temizleme ve yazılım güncellemeleri ile cihazlarınızı hızlandırıyoruz.
                </p>
                <ul className="space-y-2 text-gray-700 mb-4">
                  <li className="flex items-center">
                    <svg className="h-5 w-5 text-indigo-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    İşletim Sistemi Kurulumu
                  </li>
                  <li className="flex items-center">
                    <svg className="h-5 w-5 text-indigo-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    Virüs ve malware temizleme
                  </li>
                  <li className="flex items-center">
                    <svg className="h-5 w-5 text-indigo-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    Yazılım ve sürücü güncellemeleri
                  </li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="bg-blue-50 p-8 rounded-2xl text-center mb-16">
            <h2 className="text-2xl font-bold mb-4 text-gray-900">İhtiyacınız Olan Hizmeti Bulamadınız mı?</h2>
            <p className="text-gray-600 mb-6">
              Her türlü elektronik cihaz tamir ve bakımı için bizimle iletişime geçin, teknik servis ekibimiz size özel çözüm sunsun.
            </p>
            <a
              href="/contact"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              İletişime Geç
            </a>
          </div>
        </div>
      </div>
    </main>
  );
} 