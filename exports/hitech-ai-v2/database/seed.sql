-- ============================================================
-- HiTech AI — Sample / Demo Data
-- Run AFTER schema.sql
-- ============================================================

INSERT INTO leads (full_name, company_name, email, phone, country, requirement, console_model, referral_source, status) VALUES
  ('James Keller',    'Stadium Tours Ltd',      'james.keller@stadiumtours.com',  '+44 7700 900001', 'United Kingdom', 'Need live AI support for Quantum7 routing issues mid-show', 'Quantum7',   'LinkedIn',    'approved'),
  ('Maria Santos',    'Broadcast Solutions',    'maria.santos@bcstudio.com',      '+1 212 555 0101', 'United States',  'Dante troubleshooting and MADI configuration help',          'SD12',       'Google',      'approved'),
  ('Raj Patel',       'Live Events UAE',        'raj.patel@liveevents.ae',        '+971 50 123 4567','UAE',            'Entire crew to have WhatsApp support access for all events',  'Quantum5',   'Word of Mouth','approved'),
  ('Sophie Müller',   'Radio SWR',              'sophie.muller@swr.de',           '+49 711 456 789', 'Germany',        'SD9 show file management and remote monitoring',              'SD9',        'Audio Forum', 'pending'),
  ('Carlos Rivera',   'Producciones Rivera',    'carlos@prodrivera.mx',           '+52 55 1234 5678','Brazil',         'Optocore network setup and firmware update guidance',          'SD10',       'YouTube',     'pending'),
  ('Emma Thompson',   'The O2 Arena',           'emma.thompson@theo2.co.uk',      '+44 20 7900 1234','United Kingdom', 'Festival season support package for 5 engineers',             'Quantum338', 'Event / Show','pending'),
  ('Kenji Tanaka',    'Sony Music Live',        'kenji.tanaka@sonymusic.co.jp',   '+81 3 1234 5678', 'Japan',          'S21 console training and workflow documentation',              'S21',        'LinkedIn',    'rejected'),
  ('Priya Nair',      'Zee Entertainment',      'priya.nair@zeelive.in',          '+91 98765 43210', 'India',          'DiGiCo SD7 SILK card networking issue',                       'SD7',        'Google',      'pending'),
  ('Ahmed Hassan',    'Riyadh Events Co',       'ahmed.hassan@riyadhevents.sa',   '+966 55 987 6543','Saudi Arabia',   'WhatsApp support for 3 engineers on Quantum consoles',        'Quantum225', 'Word of Mouth','approved'),
  ('Lena Bergström',  'SVT Production',         'lena.bergstrom@svt.se',          '+46 8 123 4567',  'Sweden',         'Infinity console deep dive and advanced routing consultation', 'Infinity',   'Audio Forum', 'pending')
ON CONFLICT DO NOTHING;

INSERT INTO site_settings (key, value) VALUES
  ('siteName',              'HiTech AI'),
  ('tagline',               'AI Powered DiGiCo Support on WhatsApp'),
  ('announcementEnabled',   'true'),
  ('announcementText',      'Now Live · DiGiCo AI Support on WhatsApp'),
  ('heroHeadline',          'AI Powered DiGiCo Support on WhatsApp'),
  ('heroSubtext',           'Instant troubleshooting, console guidance, workflow assistance, and smart audio support — powered by AI, delivered straight to your WhatsApp.'),
  ('heroCta',               'Get Access'),
  ('supportHours',          '24/7 AI Support'),
  ('footerTagline',         'AI-powered DiGiCo console support'),
  ('consoleModels',         'Quantum7,Quantum5,Quantum338,Quantum225,SD12,SD10,SD9,SD7,SD5,SD-Rack,S21,Infinity')
ON CONFLICT (key) DO NOTHING;
