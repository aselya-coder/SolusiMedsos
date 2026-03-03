-- SQL Migration Script for SolusiMedsos

-- 1. Navbar
CREATE TABLE navbar (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  brand_name TEXT NOT NULL,
  brand_gradient_text TEXT NOT NULL,
  cta_text TEXT NOT NULL,
  cta_link TEXT NOT NULL
);

CREATE TABLE nav_links (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  label TEXT NOT NULL,
  href TEXT NOT NULL,
  display_order INT DEFAULT 0
);

-- 2. Hero Section
CREATE TABLE hero_section (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  badge_text TEXT NOT NULL,
  title_part1 TEXT NOT NULL,
  title_gradient TEXT NOT NULL,
  title_part2 TEXT NOT NULL,
  subtitle TEXT NOT NULL,
  primary_btn_text TEXT NOT NULL,
  primary_btn_link TEXT NOT NULL,
  secondary_btn_text TEXT NOT NULL,
  secondary_btn_link TEXT NOT NULL,
  background_image_url TEXT
);

CREATE TABLE hero_stats (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  value TEXT NOT NULL,
  label TEXT NOT NULL,
  display_order INT DEFAULT 0
);

-- 3. About Section
CREATE TABLE about_section (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  badge_text TEXT NOT NULL,
  title_part1 TEXT NOT NULL,
  title_gradient TEXT NOT NULL,
  description_1 TEXT NOT NULL,
  description_2 TEXT NOT NULL,
  image_url TEXT
);

CREATE TABLE about_advantages (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  icon_name TEXT NOT NULL,
  text TEXT NOT NULL,
  display_order INT DEFAULT 0
);

-- 4. Services Section
CREATE TABLE services (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  benefits TEXT[] NOT NULL,
  cta_text TEXT NOT NULL,
  cta_link TEXT NOT NULL,
  display_order INT DEFAULT 0
);

-- 5. How It Works
CREATE TABLE how_it_works (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  icon_name TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  step_number INT NOT NULL,
  display_order INT DEFAULT 0
);

-- 6. Pricing Section
CREATE TABLE pricing (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  name TEXT NOT NULL,
  price TEXT NOT NULL,
  is_popular BOOLEAN DEFAULT FALSE,
  display_order INT DEFAULT 0
);

CREATE TABLE pricing_features (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  pricing_id BIGINT REFERENCES pricing(id) ON DELETE CASCADE,
  feature TEXT NOT NULL,
  display_order INT DEFAULT 0
);

-- 7. Testimonials
CREATE TABLE testimonials (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  name TEXT NOT NULL,
  company TEXT NOT NULL,
  content TEXT NOT NULL,
  rating INT DEFAULT 5,
  display_order INT DEFAULT 0
);

-- 8. FAQ
CREATE TABLE faq (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  display_order INT DEFAULT 0
);

-- 9. CTA Section
CREATE TABLE cta_section (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  title_part1 TEXT NOT NULL,
  title_gradient TEXT NOT NULL,
  description TEXT NOT NULL,
  primary_btn_text TEXT NOT NULL,
  primary_btn_link TEXT NOT NULL,
  secondary_btn_text TEXT NOT NULL,
  secondary_btn_link TEXT NOT NULL
);

-- 10. Footer
CREATE TABLE footer (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  brand_name_part1 TEXT NOT NULL,
  brand_name_part2 TEXT NOT NULL,
  description TEXT NOT NULL,
  copyright_text TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  instagram_username TEXT
);

CREATE TABLE footer_links (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  label TEXT NOT NULL,
  href TEXT NOT NULL,
  category TEXT NOT NULL, -- e.g., 'Navigasi', 'Layanan'
  display_order INT DEFAULT 0
);

-- 11. WhatsApp Settings
CREATE TABLE whatsapp_settings (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  phone_number TEXT NOT NULL,
  default_message TEXT NOT NULL,
  button_text TEXT NOT NULL
);

-- Insert Default Data
INSERT INTO navbar (brand_name, brand_gradient_text, cta_text, cta_link) VALUES ('Solusi', 'Medsos', 'Konsultasi Gratis', 'https://wa.me/6281234567890');
INSERT INTO nav_links (label, href, display_order) VALUES ('Beranda', '#hero', 1), ('Tentang', '#about', 2), ('Layanan', '#services', 3), ('Harga', '#pricing', 4), ('Cara Kerja', '#how-it-works', 5), ('Testimoni', '#testimonials', 6), ('FAQ', '#faq', 7);

INSERT INTO hero_section (badge_text, title_part1, title_gradient, title_part2, subtitle, primary_btn_text, primary_btn_link, secondary_btn_text, secondary_btn_link) VALUES ('#1 Agency Buzzer Terpercaya di Indonesia', 'Solusi Jasa Buzzer &', 'Campaign Sosial Media', 'Terpercaya', 'Tingkatkan branding, engagement, dan opini publik dengan strategi digital yang terukur dan aman.', 'Konsultasi Sekarang', 'https://wa.me/6281234567890', 'Lihat Paket Harga', '#pricing');
INSERT INTO hero_stats (value, label, display_order) VALUES ('10.000+', 'Akun Jaringan', 1), ('500+', 'Campaign Sukses', 2), ('100+', 'Klien Terpercaya', 3);

INSERT INTO about_section (badge_text, title_part1, title_gradient, description_1, description_2) VALUES ('Tentang Kami', 'Agency Buzzer', 'Profesional', 'Kami adalah agency jasa buzzer profesional yang berpengalaman menangani campaign politik, brand awareness, UMKM, dan personal branding. Dengan jaringan akun real & aktif serta strategi organik yang sistematis, kami memastikan setiap campaign berjalan efektif dan terukur.', 'Didukung oleh tim strategis berpengalaman dan teknologi monitoring terkini, kami membantu klien mencapai tujuan digital mereka dengan cara yang aman dan profesional.');
INSERT INTO about_advantages (icon_name, text, display_order) VALUES ('Users', 'Akun Real & Aktif', 1), ('Target', 'Targeting Sesuai Segmentasi', 2), ('Shield', 'Aman & Rahasia', 3), ('BarChart3', 'Reporting Transparan', 4);

INSERT INTO services (title, description, benefits, cta_text, cta_link, display_order) VALUES 
('Jasa Buzzer Twitter (X)', 'Dominasi percakapan di Twitter/X dengan jaringan akun real yang siap mendukung campaign Anda.', ARRAY['Trending organik', 'Engagement tinggi', 'Targeting keyword'], 'Pesan Sekarang', 'https://wa.me/6281234567890', 1),
('Jasa Buzzer Instagram', 'Tingkatkan visibility brand di Instagram melalui likes, komentar, dan share dari akun berkualitas.', ARRAY['Boost engagement', 'Real followers', 'Story & reels support'], 'Pesan Sekarang', 'https://wa.me/6281234567890', 2),
('Jasa Buzzer TikTok', 'Viralkan konten TikTok Anda dengan dukungan views, likes, dan komentar dari akun aktif.', ARRAY['FYP strategy', 'Mass engagement', 'Konten viral'], 'Pesan Sekarang', 'https://wa.me/6281234567890', 3),
('Trending Topic Campaign', 'Buat topik trending secara organik di platform sosial media pilihan Anda.', ARRAY['Trending nasional', 'Multi-platform', 'Real-time monitoring'], 'Pesan Sekarang', 'https://wa.me/6281234567890', 4);

INSERT INTO services (title, description, benefits, cta_text, cta_link, display_order) VALUES
('Viral Marketing', 'Strategi pemasaran viral yang dirancang untuk memaksimalkan jangkauan brand Anda.', ARRAY['Content seeding', 'Influencer network', 'Amplifikasi masif'], 'Pesan Sekarang', 'https://wa.me/6281234567890', 5),
('Personal Branding', 'Bangun citra personal yang kuat dan konsisten di seluruh platform digital.', ARRAY['Konsistensi citra', 'Thought leadership', 'Media handling'], 'Pesan Sekarang', 'https://wa.me/6281234567890', 6),
('Manajemen Opini Publik', 'Kelola dan arahkan narasi publik untuk melindungi reputasi dan citra brand Anda.', ARRAY['Sentiment control', 'Counter narasi', 'Crisis management'], 'Pesan Sekarang', 'https://wa.me/6281234567890', 7),
('Campaign Politik', 'Dukungan campaign politik yang strategis, terukur, dan berpengalaman di pemilu Indonesia.', ARRAY['Ground game digital', 'Elektabilitas', 'Survey & monitoring'], 'Pesan Sekarang', 'https://wa.me/6281234567890', 8);

INSERT INTO how_it_works (icon_name, title, description, step_number, display_order) VALUES 
('MessageSquare', 'Konsultasi', 'Diskusi kebutuhan dan tujuan campaign Anda bersama tim kami.', 1, 1),
('Search', 'Analisa Target', 'Riset mendalam terhadap target audiens dan strategi optimal.', 2, 2),
('Rocket', 'Eksekusi Campaign', 'Jalankan campaign dengan jaringan akun real dan terkoordinasi.', 3, 3),
('BarChart3', 'Monitoring & Reporting', 'Pantau progress real-time dengan laporan berkala.', 4, 4),
('CheckCircle', 'Evaluasi', 'Analisa hasil dan rekomendasi untuk campaign selanjutnya.', 5, 5);

INSERT INTO pricing (name, price, is_popular, display_order) VALUES 
('Basic', 'Mulai 1.5 Jt', FALSE, 1),
('Professional', 'Mulai 5 Jt', TRUE, 2),
('Premium', 'Mulai 15 Jt', FALSE, 3),
('Custom Campaign', 'Hubungi Kami', FALSE, 4);

INSERT INTO pricing_features (pricing_id, feature, display_order) VALUES 
(1, '50 Akun Buzzer', 1), (1, 'Durasi 3 Hari', 2), (1, '1 Platform', 3), (1, 'Target 5K Engagement', 4), (1, 'Laporan Akhir Campaign', 5),
(2, '200 Akun Buzzer', 1), (2, 'Durasi 7 Hari', 2), (2, '2 Platform', 3), (2, 'Target 25K Engagement', 4), (2, 'Monitoring Harian', 5), (2, 'Laporan Detail', 6), (2, 'Bonus Konsultasi', 7),
(3, '500+ Akun Buzzer', 1), (3, 'Durasi 14 Hari', 2), (3, 'Multi Platform', 3), (3, 'Target 100K+ Engagement', 4), (3, 'Real-time Monitoring', 5), (3, 'Dedicated Account Manager', 6), (3, 'Strategi Custom', 7),
(4, 'Akun Unlimited', 1), (4, 'Durasi Fleksibel', 2), (4, 'Semua Platform', 3), (4, 'Target Menyesuaikan', 4), (4, 'Full Managed Service', 5), (4, 'Priority Support 24/7', 6), (4, 'NDA & Kontrak Resmi', 7);

INSERT INTO testimonials (name, company, content, rating, display_order) VALUES 
('Direktur Marketing', 'PT. *** Indonesia', 'Campaign yang dijalankan sangat efektif. Engagement naik 300% dalam waktu 1 minggu. Tim sangat profesional dan responsif.', 5, 1),
('Tim Sukses', 'Partai ***', 'Strategi buzzer untuk kampanye politik kami berjalan mulus dan terkoordinasi. Elektabilitas kandidat naik signifikan.', 5, 2),
('Owner UMKM', 'Brand Fashion Lokal', 'Produk kami viral di TikTok berkat campaign dari tim ini. Penjualan meningkat 5x lipat. Sangat recommended!', 5, 3),
('Public Relations', 'Perusahaan BUMN', 'Manajemen opini publik yang sangat terukur. Berhasil meredam isu negatif dan membangun narasi positif.', 5, 4);

INSERT INTO faq (question, answer, display_order) VALUES 
('Apakah akun yang digunakan real?', 'Ya, semua akun yang kami gunakan adalah akun real dan aktif. Kami tidak menggunakan bot sehingga engagement yang dihasilkan terlihat natural dan organik.', 1),
('Apakah aman dan rahasia?', 'Keamanan dan kerahasiaan klien adalah prioritas utama kami. Kami siap menandatangani NDA dan semua data campaign dijaga kerahasiaannya.', 2),
('Apakah bisa custom campaign?', 'Tentu! Kami menyediakan paket custom yang bisa disesuaikan dengan kebutuhan, budget, dan target spesifik Anda.', 3);

INSERT INTO cta_section (title_part1, title_gradient, description, primary_btn_text, primary_btn_link, secondary_btn_text, secondary_btn_link) VALUES 
('Siap Membuat Campaign Anda', 'Viral?', 'Konsultasikan kebutuhan campaign Anda sekarang juga. Tim kami siap membantu 24/7.', 'Hubungi Kami via WhatsApp', 'https://wa.me/6281234567890', 'Konsultasi Gratis', 'https://wa.me/6281234567890');

INSERT INTO footer (brand_name_part1, brand_name_part2, description, copyright_text, email, phone, instagram_username) VALUES 
('Solusi', 'Medsos', 'Agency jasa buzzer & social media campaign terpercaya di Indonesia. Solusi digital marketing untuk brand, politik, dan personal branding.', '© 2025 SolusiMedsos. All rights reserved. Disclaimer: Semua layanan yang kami berikan bersifat profesional dan bertanggung jawab.', 'info@solusimedsos.id', '6281234567890', 'solusimedsos');

INSERT INTO footer_links (label, href, category, display_order) VALUES 
('Tentang Kami', '#about', 'Navigasi', 1), ('Layanan', '#services', 'Navigasi', 2), ('Harga', '#pricing', 'Navigasi', 3), ('FAQ', '#faq', 'Navigasi', 4),
('Buzzer Twitter/X', '#', 'Layanan', 1), ('Buzzer Instagram', '#', 'Layanan', 2), ('Buzzer TikTok', '#', 'Layanan', 3), ('Campaign Politik', '#', 'Layanan', 4);

INSERT INTO whatsapp_settings (phone_number, default_message, button_text) VALUES ('6281234567890', 'Halo SolusiMedsos, saya tertarik dengan layanan campaign Anda.', 'Hubungi Kami');
