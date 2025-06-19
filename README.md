# Teknik Servis Yönetim Sistemi (Teknik Servis Boss)

> **Proje Türü**: Web Tabanlı Veritabanı Yönetim Sistemi  
> **Teknoloji Stack**: Next.js 14, TypeScript, Supabase, Tailwind CSS  
> **Geliştirme Tarihi**: 2024  
> **Amaç**: Teknik servis işletmelerinin müşteri, cihaz ve servis kayıtlarını dijital ortamda etkin şekilde yönetebilmesi

## 📋 Proje Özeti

Bu proje, teknik servis işletmelerinin günlük operasyonlarını dijitalleştirmek amacıyla geliştirilmiş kapsamlı bir web uygulamasıdır. Sistem; müşteri kayıtları, cihaz yönetimi, servis takibi ve personel yönetimi gibi temel işlevleri tek çatı altında toplamaktadır.

**Ana Hedefler:**
- Kağıt tabanlı işlemlerin dijitalleştirilmesi
- Müşteri memnuniyetini artıracak hızlı servis takibi
- Teknisyen verimliliğinin ölçülmesi ve artırılması
- Servis geçmişinin kayıt altına alınması ve raporlanması

## 🏗️ Sistem Mimarisi

### Frontend Teknolojileri
- **Next.js 14**: React tabanlı full-stack framework (App Router kullanımı)
- **TypeScript**: Tip güvenliği ve kod kalitesi için
- **Tailwind CSS**: Utility-first CSS framework
- **Radix UI**: Accessible UI components
- **React Hook Form**: Form validasyonu ve yönetimi
- **React Hot Toast**: Kullanıcı bildirimleri

### Backend ve Veritabanı
- **Supabase**: PostgreSQL veritabanı + Authentication + Real-time
- **Row Level Security (RLS)**: Veri güvenliği
- **Real-time Subscriptions**: Canlı mesajlaşma

### Proje Yapısı

teknik-servis-boss/
├── frontend/                          # Next.js Uygulaması
│   ├── src/
│   │   ├── app/                      # Next.js App Router Sayfaları
│   │   │   ├── page.tsx              # Ana sayfa (Landing Page)
│   │   │   ├── login/                # Giriş sayfası
│   │   │   ├── register/             # Kayıt sayfası
│   │   │   ├── dashboard/            # Ana kontrol paneli
│   │   │   │   ├── page.tsx          # Dashboard ana sayfası
│   │   │   │   ├── customers/        # Müşteri yönetimi
│   │   │   │   ├── devices/          # Cihaz yönetimi
│   │   │   │   ├── services/         # Servis kayıtları
│   │   │   │   ├── users/            # Kullanıcı yönetimi
│   │   │   │   └── device-parts/     # Parça fiyat yönetimi
│   │   │   ├── status/               # Servis durumu sorgulama
│   │   │   ├── about/                # Hakkımızda
│   │   │   └── contact/              # İletişim
│   │   ├── components/               # Yeniden kullanılabilir bileşenler
│   │   │   ├── ui/                   # UI bileşenleri
│   │   │   └── custom/               # Özel bileşenler
│   │   ├── lib/                      # API ve yardımcı fonksiyonlar
│   │   │   ├── api/                  # API çağrıları
│   │   │   ├── supabase.ts           # Supabase yapılandırması
│   │   │   └── utils.ts              # Yardımcı fonksiyonlar
│   │   ├── contexts/                 # React Context'leri
│   │   │   └── AuthContext.tsx       # Kimlik doğrulama
│   │   └── types/                    # TypeScript tip tanımları
│   └── package.json
├── supabase/                         # Veritabanı Şemaları
│   └── schema.sql                    # PostgreSQL veritabanı şeması
└── package.json                      # Proje scriptalari


## 🗄️ Veritabanı Tasarımı

### Varlık İlişki Diyagramı (ERD)
Sistem 7 ana tablo ve aralarındaki ilişkilerden oluşmaktadır:

**Ana Tablolar:**
1. **users** - Sistem kullanıcıları (teknisyen/admin)
2. **customers** - Müşteri bilgileri
3. **devices** - Cihaz kayıtları
4. **services** - Servis kayıtları
5. **service_messages** - Servis mesajları
6. **device_parts** - Cihaz parçaları
7. **device_part_prices** - Parça fiyat listesi

### Foreign Key İlişkileri
- `services.customer_id` → `customers.id` (CASCADE DELETE)
- `services.device_id` → `devices.id` (CASCADE DELETE)
- `services.technician_id` → `users.id` (SET NULL ON DELETE)
- `service_messages.service_id` → `services.id` (CASCADE DELETE)
- `device_part_prices.device_id` → `devices.id` (CASCADE DELETE)
- `device_part_prices.part_id` → `device_parts.id` (CASCADE DELETE)

### Güvenlik Politikaları
- Row Level Security (RLS) tüm tablolarda aktif
- Roller tabanlı erişim kontrolü (ADMIN/TEKNISYEN)
- Kimlik doğrulanmış kullanıcılar için okuma yetkisi
- Admin ve teknisyenler için yazma yetkisi

## 📱 Sistem Sayfaları ve İşlevleri

### 🏠 Ana Sayfa (`/`)
**Amaç**: Ziyaretçileri karşılama ve sistemi tanıtma
**İçerik**:
- Hero section ile ana mesaj
- Özellik kartları (Müşteri Yönetimi, Cihaz Takibi, Servis Durumu)
- Hızlı erişim butonları
- Responsive tasarım

**Teknik Özellikler**:
- Server-side rendering
- Modern animasyonlar
- Mobile-first yaklaşım

### 🔐 Kimlik Doğrulama Sistemi

#### Giriş Sayfası (`/login`)
**İşlevler**:
- Email/şifre ile giriş
- Form validasyonu
- Hata yönetimi
- Otomatik yönlendirme

#### Kayıt Sayfası (`/register`)
**İşlevler**:
- Yeni kullanıcı kaydı
- Email benzersizlik kontrolü
- Şifre güvenlik kuralları
- Varsayılan TEKNISYEN rolü

### 📊 Dashboard (`/dashboard`)
**Amaç**: Sistem genelinin özet görünümü
**Gösterilen Veriler**:
- Toplam müşteri sayısı
- Aktif servis sayısı
- Bekleyen servislerin listesi
- Son eklenen müşteriler
- Hızlı işlem butonları

**Teknik Özellikler**:
- Real-time veri güncellemeleri
- Responsive grid layout
- Filtreleme ve arama işlevleri

### 👥 Müşteri Yönetimi (`/dashboard/customers`)

#### Ana Liste Sayfası
**İşlevler**:
- Tüm müşterilerin listelenmesi
- Ad, telefon, email arama
- Alfabetik sıralama
- Sayfalandırma (pagination)

#### Müşteri Detay/Düzenleme (`/dashboard/customers/[id]`)
**İşlevler**:
- Müşteri bilgilerini görüntüleme/düzenleme
- Müşteriye ait servis geçmişi
- Yeni servis oluşturma bağlantısı

#### Müşteri Ekleme (`/dashboard/customers/new`)
**Validasyon Kuralları**:
- İsim: Zorunlu, min 2 karakter
- Telefon: Zorunlu, format kontrolü
- Email: Opsiyonel, format kontrolü
- Adres: Opsiyonel

**Silme İşlemi**:
- Foreign key kontrollü silme
- Cascade delete seçeneği
- Onay dialog'u

### 💻 Cihaz Yönetimi (`/dashboard/devices`)

#### Ana Liste Sayfası
**İşlevler**:
- Cihaz listesi (marka, model, tür)
- Arama ve filtreleme
- Genişletilebilir kart görünümü
- Parça fiyat bilgileri

#### Cihaz Detay/Düzenleme (`/dashboard/devices/[id]`)
**İşlevler**:
- Cihaz özelliklerini düzenleme
- Parça fiyat listesi yönetimi
- Yeni parça ekleme
- Fiyat güncelleme

#### Cihaz Ekleme (`/dashboard/devices/new`)
**Alanlar**:
- Tür (dropdown selection)
- Marka ve Model
- Seri numarası (opsiyonel)

### 🔧 Servis Yönetimi (`/dashboard/services`)

#### Ana Liste Sayfası
**İşlevler**:
- Servis kayıtlarının listelenmesi
- Durum bazlı filtreleme (BEKLEMEDE, DEVAM_EDIYOR, TAMAMLANDI)
- Teknisyen bazlı filtreleme
- Tarih aralığı seçimi

**Gösterilen Bilgiler**:
- Müşteri adı ve iletişim
- Cihaz bilgileri
- Problem açıklaması
- Atanan teknisyen
- Servis durumu
- Oluşturulma tarihi

#### Servis Detay (`/dashboard/services/[id]`)
**İşlevler**:
- Servis detaylarını görüntüleme/düzenleme
- Müşteri ile mesajlaşma sistemi
- Durum güncelleme
- Teknisyen atama
- Çözüm ve tanı yazma
- Fiyat belirleme

**Mesajlaşma Sistemi**:
- Real-time mesaj güncellemeleri
- Müşteri/teknisyen ayrımı
- Zaman damgası
- Otomatik scroll

#### Yeni Servis Oluşturma (`/dashboard/services/new`)
**Adımlar**:
1. Müşteri seçimi (dropdown/arama)
2. Cihaz seçimi
3. Problem tanımı
4. İlk durum ataması

### 👤 Kullanıcı Yönetimi (`/dashboard/users`)
**Yetki**: Sadece ADMIN kullanıcılar
**İşlevler**:
- Teknisyen listesi
- Yeni teknisyen ekleme
- Rol değiştirme (ADMIN/TEKNISYEN)
- Kullanıcı silme (kendi hesabı hariç)

**Güvenlik Kontrolleri**:
- Kendini silmeyi engelleme
- Kendi rolünü değiştirmeyi engelleme
- Atanmış servisleri olan kullanıcı silme kontrolü

### 🔍 Servis Durumu Sorgulama (`/status`)
**Amaç**: Müşterilerin kendi servis durumlarını öğrenmesi
**İşlevler**:
- Telefon numarası ile sorgulama
- Servis geçmişi görüntüleme
- Durum bilgisi
- İletişim bilgileri

### 📞 İletişim ve Kurumsal Sayfalar

#### Hakkımızda (`/about`)
- Şirket tanıtımı
- Vizyon/Misyon
- Hizmet alanları

#### İletişim (`/contact`)
- İletişim formu
- Adres ve harita
- Telefon/Email bilgileri
- Çalışma saatleri

## 🔒 Güvenlik Özellikleri

### Authentication & Authorization
- Supabase Auth ile güvenli kimlik doğrulama
- JWT token bazlı oturum yönetimi
- Rol bazlı erişim kontrolü (RBAC)
- Otomatik oturum sonlandırma




## ⚙️ Kurulum ve Çalıştırma

### Ön Gereksinimler
- Node.js 18+ 
- npm veya yarn
- Supabase hesabı

### 1. Proje Kurulumu
bash
cd teknik-servis-boss
npm install
cd frontend && npm install


### 2. Environment Ayarları
`frontend/.env.local` dosyası oluşturun:
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key


### 3. Veritabanı Kurulumu
Supabase Dashboard'da:
1. Yeni proje oluşturun
2. `supabase/schema.sql` dosyasını SQL Editor'de çalıştırın
3. RLS politikalarının aktif olduğunu kontrol edin

### 4. Uygulamayı Çalıştırma
bash
# Development modu
npm run dev

# Production build
npm run build
npm start


Uygulama `http://localhost:3000` adresinde çalışır.

### 5. İlk Kullanıcı Oluşturma
1. `/register` sayfasından kayıt olun
2. Supabase Dashboard'dan kullanıcı rolünü 'ADMIN' yapın
3. Sisteme admin olarak giriş yapın

## 🧪 Test ve Kalite Kontrol

### Kod Kalitesi
- ESLint konfigürasyonu
- TypeScript strict mode
- Prettier code formatting

### Test Edilen Senaryolar
- Kullanıcı kimlik doğrulama
- CRUD işlemleri
- Foreign key constraint'leri
- Real-time mesajlaşma
- Responsive tasarım

## 📈 Performans Optimizasyonları

- **Next.js App Router**: Otomatik code splitting
- **Server Components**: Sunucu tarafı rendering
- **Image Optimization**: Next.js Image component
- **Lazy Loading**: Component bazlı lazy loading
- **Database Indexing**: Performanslı sorgular için indexler

## 🔄 Gelecek Geliştirmeler

### Kısa Vadeli
- PDF rapor çıktıları
- Email bildirimleri
- Bulk import/export
- Gelişmiş filtreleme

### Uzun Vadeli
- Mobile aplikasyon
- QR kod entegrasyonu
- Fatura sistemi
- CRM entegrasyonu
- API dokümantasyonu

## 🐛 Bilinen Sorunlar ve Çözümler

### Foreign Key Constraint Error
**Hata**: "Unable to delete row as it is currently referenced by a foreign key constraint"
**Çözüm**: Sistem otomatik olarak cascade delete veya kontrollü silme seçenekleri sunar

### Authentication Timeout
**Hata**: Token süresi dolması
**Çözüm**: Otomatik token yenileme ve graceful logout

## 📚 Teknik Dokümantasyon

### API Endpoints
- `GET /api/customers` - Müşteri listesi
- `POST /api/customers` - Yeni müşteri
- `PUT /api/customers/:id` - Müşteri güncelleme
- `DELETE /api/customers/:id` - Müşteri silme

### Component Yapısı
typescript

interface Customer {
  id: number;
  name: string;
  phone: string;
  email?: string;
  address?: string;
  created_at: string;
  updated_at: string;
}

const customers = {
  getAll: async (): Promise<Customer[]> => {
    const { data, error } = await supabase
      .from('customers')
      .select('*');
    if (error) throw error;
    return data;
  }
}