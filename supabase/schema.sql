-- Kullanıcılar tablosu
CREATE TABLE users (
  id BIGSERIAL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'TEKNISYEN',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Müşteriler tablosu
CREATE TABLE customers (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Cihazlar tablosu
CREATE TABLE devices (
  id BIGSERIAL PRIMARY KEY,
  type TEXT NOT NULL,
  brand TEXT NOT NULL,
  model TEXT NOT NULL,
  serial_number TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Servis kayıtları tablosu
CREATE TABLE services (
  id BIGSERIAL PRIMARY KEY,
  customer_id BIGINT REFERENCES customers(id) ON DELETE CASCADE NOT NULL,
  device_id BIGINT REFERENCES devices(id) ON DELETE CASCADE NOT NULL,
  technician_id BIGINT REFERENCES users(id) ON DELETE SET NULL,
  problem TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'BEKLEMEDE',
  diagnosis TEXT,
  solution TEXT,
  price DECIMAL(10, 2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Servis mesajları tablosu
CREATE TABLE service_messages (
  id BIGSERIAL PRIMARY KEY,
  service_id BIGINT REFERENCES services(id) ON DELETE CASCADE NOT NULL,
  message TEXT NOT NULL,
  is_from_customer BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Cihaz parçaları tablosu
CREATE TABLE device_parts (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Cihaz parça fiyatları tablosu
CREATE TABLE device_part_prices (
  id BIGSERIAL PRIMARY KEY,
  device_id BIGINT REFERENCES devices(id) ON DELETE CASCADE NOT NULL,
  part_id BIGINT REFERENCES device_parts(id) ON DELETE CASCADE NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(device_id, part_id)
);

-- Güncelleme tetikleyicisi için fonksiyon
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Güncelleme tetikleyicileri
CREATE TRIGGER update_users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_customers_updated_at
BEFORE UPDATE ON customers
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_devices_updated_at
BEFORE UPDATE ON devices
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_services_updated_at
BEFORE UPDATE ON services
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_device_parts_updated_at
BEFORE UPDATE ON device_parts
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_device_part_prices_updated_at
BEFORE UPDATE ON device_part_prices
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- RLS (Row Level Security) Politikaları
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE devices ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE device_parts ENABLE ROW LEVEL SECURITY;
ALTER TABLE device_part_prices ENABLE ROW LEVEL SECURITY;

-- Kullanıcılar için politika
CREATE POLICY "Kullanıcılar herkese görünür"
ON users FOR SELECT
TO authenticated
USING (true);

-- Müşteriler için politika
CREATE POLICY "Müşteriler herkese görünür"
ON customers FOR SELECT
TO authenticated
USING (true);

-- Cihazlar için politika
CREATE POLICY "Cihazlar herkese görünür"
ON devices FOR SELECT
TO authenticated
USING (true);

-- Servisler için politika
CREATE POLICY "Servisler herkese görünür"
ON services FOR SELECT
TO authenticated
USING (true);

-- Servis mesajları için politika
CREATE POLICY "Servis mesajları herkese görünür"
ON service_messages FOR SELECT
TO authenticated
USING (true);

-- Cihaz parçaları için politika
CREATE POLICY "Cihaz parçaları herkese görünür"
ON device_parts FOR SELECT
TO authenticated
USING (true);

-- Cihaz parça fiyatları için politika
CREATE POLICY "Cihaz parça fiyatları herkese görünür"
ON device_part_prices FOR SELECT
TO authenticated
USING (true);

-- Yazma politikaları (sadece admin ve teknisyen kullanıcılar için)
CREATE POLICY "Admin ve teknisyenler müşteri ekleyebilir"
ON customers FOR INSERT
TO authenticated
USING (auth.jwt() ->> 'role' IN ('ADMIN', 'TEKNISYEN'));

CREATE POLICY "Admin ve teknisyenler müşteri güncelleyebilir"
ON customers FOR UPDATE
TO authenticated
USING (auth.jwt() ->> 'role' IN ('ADMIN', 'TEKNISYEN'));

-- Benzer politikalar diğer tablolar için de eklenebilir 