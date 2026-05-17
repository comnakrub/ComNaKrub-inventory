import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const seedParts = [
  // CPU
  { name: 'Intel Core i9-14900K', category: 'CPU', brand: 'Intel', model: 'i9-14900K', quantity: 5, costPrice: 18500, sellPrice: 21900, barcode: 'CPU-I9-14900K' },
  { name: 'Intel Core i7-14700K', category: 'CPU', brand: 'Intel', model: 'i7-14700K', quantity: 8, costPrice: 13500, sellPrice: 15900, barcode: 'CPU-I7-14700K' },
  { name: 'Intel Core i5-14600K', category: 'CPU', brand: 'Intel', model: 'i5-14600K', quantity: 12, costPrice: 9500, sellPrice: 11500, barcode: 'CPU-I5-14600K' },
  { name: 'AMD Ryzen 9 7950X', category: 'CPU', brand: 'AMD', model: 'R9-7950X', quantity: 4, costPrice: 22000, sellPrice: 25900, barcode: 'CPU-R9-7950X' },
  { name: 'AMD Ryzen 7 7700X', category: 'CPU', brand: 'AMD', model: 'R7-7700X', quantity: 10, costPrice: 10500, sellPrice: 12500, barcode: 'CPU-R7-7700X' },
  { name: 'AMD Ryzen 5 7600X', category: 'CPU', brand: 'AMD', model: 'R5-7600X', quantity: 15, costPrice: 7500, sellPrice: 8900, barcode: 'CPU-R5-7600X' },

  // RAM
  { name: 'Kingston Fury Beast DDR5 32GB (2x16) 6000MHz', category: 'RAM', brand: 'Kingston', model: 'KF560C36BBEK2-32', quantity: 20, costPrice: 3500, sellPrice: 4200, barcode: 'RAM-KF-DDR5-32-6000' },
  { name: 'Kingston Fury Beast DDR4 16GB (2x8) 3200MHz', category: 'RAM', brand: 'Kingston', model: 'KF432C16BBK2-16', quantity: 25, costPrice: 1800, sellPrice: 2200, barcode: 'RAM-KF-DDR4-16-3200' },
  { name: 'G.Skill Trident Z5 DDR5 32GB (2x16) 6400MHz', category: 'RAM', brand: 'G.Skill', model: 'F5-6400J3239G16GX2-TZ5RK', quantity: 10, costPrice: 5500, sellPrice: 6500, barcode: 'RAM-GS-DDR5-32-6400' },
  { name: 'Corsair Vengeance DDR5 64GB (2x32) 5600MHz', category: 'RAM', brand: 'Corsair', model: 'CMK64GX5M2B5600C36', quantity: 8, costPrice: 8000, sellPrice: 9500, barcode: 'RAM-CO-DDR5-64-5600' },

  // VGA
  { name: 'NVIDIA RTX 4090 24GB Founders Edition', category: 'VGA', brand: 'NVIDIA', model: 'RTX 4090 FE', quantity: 3, costPrice: 60000, sellPrice: 68000, barcode: 'VGA-NV-RTX4090' },
  { name: 'NVIDIA RTX 4080 Super 16GB', category: 'VGA', brand: 'ASUS', model: 'ROG STRIX RTX4080S-O16G', quantity: 5, costPrice: 38000, sellPrice: 44900, barcode: 'VGA-AS-RTX4080S' },
  { name: 'NVIDIA RTX 4070 Ti Super 16GB', category: 'VGA', brand: 'MSI', model: 'RTX 4070 Ti SUPER 16G GAMING X SLIM', quantity: 7, costPrice: 26000, sellPrice: 30900, barcode: 'VGA-MS-RTX4070TIS' },
  { name: 'AMD RX 7900 XTX 24GB', category: 'VGA', brand: 'Sapphire', model: 'NITRO+ RX 7900 XTX 24G', quantity: 4, costPrice: 32000, sellPrice: 37900, barcode: 'VGA-SA-RX7900XTX' },
  { name: 'NVIDIA RTX 4060 Ti 16GB', category: 'VGA', brand: 'Gigabyte', model: 'GV-N406TGAMING OC-16GD', quantity: 10, costPrice: 14000, sellPrice: 16900, barcode: 'VGA-GB-RTX4060TI16' },

  // MB
  { name: 'ASUS ROG MAXIMUS Z790 HERO', category: 'MB', brand: 'ASUS', model: 'ROG MAXIMUS Z790 HERO', quantity: 3, costPrice: 22000, sellPrice: 26900, barcode: 'MB-AS-Z790-HERO' },
  { name: 'MSI MAG Z790 TOMAHAWK WIFI', category: 'MB', brand: 'MSI', model: 'MAG Z790 TOMAHAWK WIFI', quantity: 8, costPrice: 8500, sellPrice: 10500, barcode: 'MB-MS-Z790-TOMAHAWK' },
  { name: 'Gigabyte B760M AORUS ELITE AX', category: 'MB', brand: 'Gigabyte', model: 'B760M AORUS ELITE AX', quantity: 12, costPrice: 4800, sellPrice: 5900, barcode: 'MB-GB-B760M-AORUS' },
  { name: 'ASUS ROG CROSSHAIR X670E HERO', category: 'MB', brand: 'ASUS', model: 'ROG CROSSHAIR X670E HERO', quantity: 3, costPrice: 20000, sellPrice: 24900, barcode: 'MB-AS-X670E-HERO' },
  { name: 'MSI MEG X670E ACE', category: 'MB', brand: 'MSI', model: 'MEG X670E ACE', quantity: 4, costPrice: 18000, sellPrice: 21900, barcode: 'MB-MS-X670E-ACE' },

  // PSU
  { name: 'Seasonic PRIME TX-1300W 80+ Titanium', category: 'PSU', brand: 'Seasonic', model: 'PRIME TX-1300', quantity: 5, costPrice: 8000, sellPrice: 9500, barcode: 'PSU-SS-TX1300' },
  { name: 'Corsair RM1000x SHIFT 1000W 80+ Gold', category: 'PSU', brand: 'Corsair', model: 'RM1000x SHIFT', quantity: 8, costPrice: 5500, sellPrice: 6500, barcode: 'PSU-CO-RM1000X' },
  { name: 'be quiet! Dark Power Pro 13 850W 80+ Titanium', category: 'PSU', brand: 'be quiet!', model: 'Dark Power Pro 13 850W', quantity: 6, costPrice: 7500, sellPrice: 8900, barcode: 'PSU-BQ-DPP13-850' },
  { name: 'EVGA SuperNOVA 750W G6 80+ Gold', category: 'PSU', brand: 'EVGA', model: 'SuperNOVA 750 G6', quantity: 10, costPrice: 3500, sellPrice: 4200, barcode: 'PSU-EV-750G6' },

  // CASE
  { name: 'Lian Li PC-O11D EVO RGB', category: 'CASE', brand: 'Lian Li', model: 'PC-O11D EVO RGB', quantity: 6, costPrice: 5500, sellPrice: 6500, barcode: 'CASE-LL-O11DEVO' },
  { name: 'NZXT H9 Elite', category: 'CASE', brand: 'NZXT', model: 'H9 Elite', quantity: 4, costPrice: 6500, sellPrice: 7900, barcode: 'CASE-NZ-H9E' },
  { name: 'Fractal Design Torrent', category: 'CASE', brand: 'Fractal Design', model: 'Torrent', quantity: 5, costPrice: 5000, sellPrice: 6000, barcode: 'CASE-FD-TORRENT' },
  { name: 'Corsair 4000D Airflow', category: 'CASE', brand: 'Corsair', model: '4000D Airflow', quantity: 10, costPrice: 3200, sellPrice: 3900, barcode: 'CASE-CO-4000D' },

  // Monitor
  { name: 'ASUS ROG Swift PG32UQX 4K 144Hz', category: 'Monitor', brand: 'ASUS', model: 'PG32UQX', quantity: 3, costPrice: 45000, sellPrice: 54900, barcode: 'MON-AS-PG32UQX' },
  { name: 'LG 27GP950-B UltraGear 4K 160Hz', category: 'Monitor', brand: 'LG', model: '27GP950-B', quantity: 6, costPrice: 18000, sellPrice: 21900, barcode: 'MON-LG-27GP950B' },
  { name: 'Samsung Odyssey G7 32" 2K 240Hz', category: 'Monitor', brand: 'Samsung', model: 'LC32G75TQSNXZA', quantity: 5, costPrice: 15000, sellPrice: 18500, barcode: 'MON-SA-G732' },
  { name: 'BenQ Mobiuz EX2710Q 27" 2K 165Hz', category: 'Monitor', brand: 'BenQ', model: 'EX2710Q', quantity: 8, costPrice: 9500, sellPrice: 11900, barcode: 'MON-BQ-EX2710Q' },

  // M.2
  { name: 'Samsung 990 Pro 2TB NVMe PCIe 4.0', category: 'M.2', brand: 'Samsung', model: '990 Pro 2TB', quantity: 15, costPrice: 4500, sellPrice: 5500, barcode: 'M2-SA-990PRO-2T' },
  { name: 'WD Black SN850X 2TB NVMe PCIe 4.0', category: 'M.2', brand: 'Western Digital', model: 'SN850X 2TB', quantity: 12, costPrice: 4200, sellPrice: 5200, barcode: 'M2-WD-SN850X-2T' },
  { name: 'Seagate FireCuda 530 1TB NVMe PCIe 4.0', category: 'M.2', brand: 'Seagate', model: 'FireCuda 530 1TB', quantity: 10, costPrice: 2800, sellPrice: 3500, barcode: 'M2-SG-FC530-1T' },
  { name: 'Kingston Fury Renegade 4TB PCIe 4.0', category: 'M.2', brand: 'Kingston', model: 'SFYRD/4000G', quantity: 5, costPrice: 9500, sellPrice: 11900, barcode: 'M2-KG-FURY4T' },

  // SSD
  { name: 'Samsung 870 EVO 4TB SATA', category: 'SSD', brand: 'Samsung', model: '870 EVO 4TB', quantity: 8, costPrice: 6500, sellPrice: 7900, barcode: 'SSD-SA-870EVO-4T' },
  { name: 'Crucial MX500 2TB SATA', category: 'SSD', brand: 'Crucial', model: 'MX500 2TB', quantity: 12, costPrice: 2800, sellPrice: 3500, barcode: 'SSD-CR-MX500-2T' },
  { name: 'Seagate BarraCuda 4TB SATA', category: 'SSD', brand: 'Seagate', model: 'BarraCuda 4TB', quantity: 10, costPrice: 3500, sellPrice: 4200, barcode: 'SSD-SG-BARCUDA-4T' },

  // Cooler
  { name: 'Noctua NH-D15 Chromax Black', category: 'Cooler', brand: 'Noctua', model: 'NH-D15 Chromax Black', quantity: 8, costPrice: 4500, sellPrice: 5500, barcode: 'COOL-NO-NHD15B' },
  { name: 'be quiet! Dark Rock Pro 4', category: 'Cooler', brand: 'be quiet!', model: 'Dark Rock Pro 4', quantity: 6, costPrice: 3500, sellPrice: 4200, barcode: 'COOL-BQ-DRP4' },
  { name: 'ARCTIC Liquid Freezer III 360', category: 'Cooler', brand: 'ARCTIC', model: 'Liquid Freezer III 360', quantity: 5, costPrice: 5500, sellPrice: 6500, barcode: 'COOL-AR-LF3-360' },
  { name: 'NZXT Kraken Elite 360 RGB', category: 'Cooler', brand: 'NZXT', model: 'Kraken Elite 360 RGB', quantity: 6, costPrice: 7500, sellPrice: 8900, barcode: 'COOL-NZ-KE360' },
  { name: 'Corsair iCUE H150i Elite Capellix 360', category: 'Cooler', brand: 'Corsair', model: 'H150i Elite Capellix', quantity: 7, costPrice: 6500, sellPrice: 7900, barcode: 'COOL-CO-H150I' },

  // FAN
  { name: 'Noctua NF-A12x25 PWM 120mm', category: 'FAN', brand: 'Noctua', model: 'NF-A12x25 PWM', quantity: 30, costPrice: 800, sellPrice: 990, barcode: 'FAN-NO-NFA12' },
  { name: 'be quiet! Silent Wings 4 120mm PWM', category: 'FAN', brand: 'be quiet!', model: 'Silent Wings 4 120mm', quantity: 25, costPrice: 700, sellPrice: 890, barcode: 'FAN-BQ-SW4-120' },
  { name: 'Lian Li UNI FAN SL-Infinity 120mm (3-pack)', category: 'FAN', brand: 'Lian Li', model: 'UNI FAN SL-Infinity 120mm', quantity: 15, costPrice: 1800, sellPrice: 2200, barcode: 'FAN-LL-SLIF120-3P' },
  { name: 'Corsair LL120 RGB 120mm (3-pack)', category: 'FAN', brand: 'Corsair', model: 'CO-9050072-WW', quantity: 20, costPrice: 1500, sellPrice: 1900, barcode: 'FAN-CO-LL120-3P' },
]

async function main() {
  console.log('Seeding database...')

  for (const part of seedParts) {
    await prisma.part.upsert({
      where: { barcode: part.barcode },
      update: {},
      create: part,
    })
  }

  console.log(`Seeded ${seedParts.length} parts`)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
