import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const seedParts = [
  // CPU - 24 items
  { category: 'CPU', name: 'CPU AMD AM4 ATHLON Pro A8-9600', brand: 'AMD', model: 'A8', quantity: 1, costPrice: 100, sellPrice: 0, note: '', cpuPackage: 'Box', cpuSocket: 'AM4', cpuCodename: 'Bristol Ridge' },
  { category: 'CPU', name: 'CPU INTEL CORE I3-10105', brand: 'INTEL', model: 'CORE I3', quantity: 0, costPrice: 0, sellPrice: 0, note: '', cpuPackage: 'Box', cpuSocket: '1200', cpuCodename: 'Intel Core Gen 10th' },
  { category: 'CPU', name: 'CPU INTEL CORE I3-10100', brand: 'INTEL', model: 'CORE I3', quantity: 1, costPrice: 1000, sellPrice: 0, note: '', cpuPackage: 'Tray', cpuSocket: '1200', cpuCodename: 'Intel Core Gen 10th' },
  { category: 'CPU', name: 'CPU INTEL CORE I5-10500', brand: 'INTEL', model: 'CORE I5', quantity: 1, costPrice: 2100, sellPrice: 0, note: '', cpuPackage: 'Tray', cpuSocket: '1200', cpuCodename: 'Intel Core Gen 10th' },
  { category: 'CPU', name: 'CPU INTEL CORE I7-10700', brand: 'INTEL', model: 'CORE I7', quantity: 1, costPrice: 3500, sellPrice: 0, note: '', cpuPackage: 'Tray', cpuSocket: '1200', cpuCodename: 'Intel Core Gen 10th' },
  { category: 'CPU', name: 'CPU INTEL CORE I3-12100', brand: 'INTEL', model: 'CORE I3', quantity: 0, costPrice: 0, sellPrice: 0, note: '', cpuPackage: 'Box', cpuSocket: '1700', cpuCodename: 'Intel Core Gen 12th' },
  { category: 'CPU', name: 'CPU INTEL CORE I3-12100F', brand: 'INTEL', model: 'CORE I3', quantity: 3, costPrice: 4500, sellPrice: 0, note: '', cpuPackage: 'Box', cpuSocket: '1700', cpuCodename: 'Intel Core Gen 12th' },
  { category: 'CPU', name: 'CPU INTEL CORE I5-14500', brand: 'INTEL', model: 'CORE I5', quantity: 1, costPrice: 5000, sellPrice: 0, note: '', cpuPackage: 'Tray', cpuSocket: '1700', cpuCodename: 'Intel Core Gen 14th' },
  { category: 'CPU', name: 'CPU INTEL CORE I5-14400F', brand: 'INTEL', model: 'CORE I5', quantity: 1, costPrice: 3600, sellPrice: 0, note: '', cpuPackage: 'Box', cpuSocket: '1700', cpuCodename: 'Intel Core Gen 14th' },
  { category: 'CPU', name: 'CPU INTEL CORE I5-12400F', brand: 'INTEL', model: 'CORE I5', quantity: 2, costPrice: 6000, sellPrice: 0, note: '', cpuPackage: 'Box', cpuSocket: '1700', cpuCodename: 'Intel Core Gen 12th' },
  { category: 'CPU', name: 'CPU AMD AM4 RYZEN 7 5700X', brand: 'AMD', model: 'Ryzen 7', quantity: 1, costPrice: 4000, sellPrice: 0, note: '', cpuPackage: 'Box', cpuSocket: 'AM4', cpuCodename: '5000 Series' },
  { category: 'CPU', name: 'CPU AMD AM4 RYZEN 5 5600GT', brand: 'AMD', model: 'Ryzen 5', quantity: 1, costPrice: 3000, sellPrice: 0, note: '', cpuPackage: 'Box', cpuSocket: 'AM4', cpuCodename: '5000 Series' },
  { category: 'CPU', name: 'CPU AMD AM4 RYZEN 5 2600', brand: 'AMD', model: 'Ryzen 5', quantity: 2, costPrice: 2000, sellPrice: 0, note: '', cpuPackage: 'Tray', cpuSocket: 'AM4', cpuCodename: '2000 Series' },
  { category: 'CPU', name: 'CPU AMD AM4 RYZEN 5 4500', brand: 'AMD', model: 'Ryzen 5', quantity: 1, costPrice: 2000, sellPrice: 0, note: '', cpuPackage: 'Box', cpuSocket: 'AM4', cpuCodename: '4000 Series' },
  { category: 'CPU', name: 'CPU AMD AM4 RYZEN 5 4500', brand: 'AMD', model: 'Ryzen 5', quantity: 1, costPrice: 1500, sellPrice: 0, note: '', cpuPackage: 'Tray', cpuSocket: 'AM4', cpuCodename: '4000 Series' },
  { category: 'CPU', name: 'CPU AMD AM4 RYZEN 3 3300X', brand: 'AMD', model: 'Ryzen 3', quantity: 0, costPrice: 0, sellPrice: 0, note: '', cpuPackage: 'Box', cpuSocket: 'AM4', cpuCodename: '3000 Series' },
  { category: 'CPU', name: 'CPU AMD AM4 RYZEN 3 2200G', brand: 'AMD', model: 'Ryzen 3', quantity: 1, costPrice: 1000, sellPrice: 0, note: '', cpuPackage: 'Box', cpuSocket: 'AM4', cpuCodename: '2000 Series' },
  { category: 'CPU', name: 'CPU INTEL 1200 CORE I5-10400', brand: 'INTEL', model: 'CORE I5', quantity: 0, costPrice: 0, sellPrice: 0, note: '', cpuPackage: 'Tray', cpuSocket: '1200', cpuCodename: 'Intel Core Gen 10th' },
  { category: 'CPU', name: 'CPU INTEL 1200 CORE I3-10100F', brand: 'INTEL', model: 'CORE I3', quantity: 0, costPrice: 0, sellPrice: 0, note: '', cpuPackage: 'Tray', cpuSocket: '1200', cpuCodename: 'Intel Core Gen 10th' },
  { category: 'CPU', name: 'CPU INTEL CORE I3-13100F', brand: 'INTEL', model: 'CORE I3', quantity: 0, costPrice: 0, sellPrice: 0, note: '', cpuPackage: 'Box', cpuSocket: '1700', cpuCodename: 'Intel Core Gen 13th' },
  { category: 'CPU', name: 'CPU AMD AM4 RYZEN 7 3700X', brand: 'AMD', model: 'Ryzen 7', quantity: 0, costPrice: 0, sellPrice: 0, note: '', cpuPackage: 'Box', cpuSocket: 'AM4', cpuCodename: '3000 Series' },
  { category: 'CPU', name: 'CPU AMD AM4 RYZEN 5 5600X', brand: 'AMD', model: 'Ryzen 5', quantity: 0, costPrice: 0, sellPrice: 0, note: '', cpuPackage: 'Box', cpuSocket: 'AM4', cpuCodename: '5000 Series' },
  { category: 'CPU', name: 'CPU INTEL CORE I7-12700', brand: 'INTEL', model: 'CORE I7', quantity: 0, costPrice: 0, sellPrice: 0, note: '', cpuPackage: 'Tray', cpuSocket: '1700', cpuCodename: 'Intel Core Gen 12th' },
  { category: 'CPU', name: 'CPU INTEL CORE I9-13900K', brand: 'INTEL', model: 'CORE I9', quantity: 0, costPrice: 0, sellPrice: 0, note: '', cpuPackage: 'Box', cpuSocket: '1700', cpuCodename: 'Intel Core Gen 13th' },

  // RAM - 24 items
  { category: 'RAM', name: 'G.SKILLTrident Z5 RGB DDR5 7200MHz 48GB (2x24GB)', brand: 'G.SKILL', model: 'Trident Z5', quantity: 1, costPrice: 10000, sellPrice: 0, note: '', ramColor: 'Black', ramRgb: true, ramPackage: 'Box', ramMemoryType: 'DDR5', ramBus: 7200, ramSize: '48GB' },
  { category: 'RAM', name: 'CORSAIR VENGEANCE DDR5 32GB 5600MHz (2x16GB)', brand: 'CORSAIR', model: 'VENGEANCE', quantity: 1, costPrice: 6500, sellPrice: 0, note: '', ramColor: 'Black', ramRgb: false, ramPackage: 'Box', ramMemoryType: 'DDR5', ramBus: 5600, ramSize: '32GB' },
  { category: 'RAM', name: 'PATRIOT VIPER STEEL DDR4 4400MHz (2x8GB)', brand: 'Patriot', model: 'VIPER STEEL', quantity: 1, costPrice: 1500, sellPrice: 0, note: '', ramColor: 'Gray', ramRgb: false, ramPackage: 'Tray', ramMemoryType: 'DDR4', ramBus: 4400, ramSize: '16GB' },
  { category: 'RAM', name: 'PATRIOT VIPER STEEL DDR4 3200MHz (1x8GB)', brand: 'Patriot', model: 'VIPER STEEL', quantity: 1, costPrice: 800, sellPrice: 0, note: '', ramColor: 'Black', ramRgb: false, ramPackage: 'Tray', ramMemoryType: 'DDR4', ramBus: 3200, ramSize: '8GB' },
  { category: 'RAM', name: 'TT ToughRAM RGB DDR4-4400Mhz 32GB (4x8GB)', brand: 'THERMALTAKE', model: 'TOUGHRAM', quantity: 1, costPrice: 2250, sellPrice: 0, note: '', ramColor: 'Black', ramRgb: true, ramPackage: 'Tray', ramMemoryType: 'DDR4', ramBus: 4400, ramSize: '32GB' },
  { category: 'RAM', name: 'TT ToughRAM RGB DDR4-4400Mhz 16GB (2x8GB)', brand: 'THERMALTAKE', model: 'TOUGHRAM', quantity: 1, costPrice: 3000, sellPrice: 0, note: '', ramColor: 'Black', ramRgb: true, ramPackage: 'Box', ramMemoryType: 'DDR4', ramBus: 4400, ramSize: '16GB' },
  { category: 'RAM', name: 'TEAM T-FORCE DELTA RGB BLACK (2x8GB)', brand: 'TEAMGROUP', model: 'T-FORCE', quantity: 0, costPrice: 0, sellPrice: 0, note: '', ramColor: 'Black', ramRgb: true, ramPackage: 'Box', ramMemoryType: 'DDR4', ramBus: 3200, ramSize: '16GB' },
  { category: 'RAM', name: 'Corsair Vengeance LPX 32GB DDR4 3200MHz (2x16GB)', brand: 'CORSAIR', model: 'VENGEANCE', quantity: 2, costPrice: 6000, sellPrice: 0, note: '', ramColor: 'Black', ramRgb: false, ramPackage: 'Box', ramMemoryType: 'DDR4', ramBus: 3200, ramSize: '32GB' },
  { category: 'RAM', name: 'Corsair Vengeance LPX 32GB DDR4 3200MHz (2x16GB)', brand: 'CORSAIR', model: 'VENGEANCE', quantity: 0, costPrice: 0, sellPrice: 0, note: '', ramColor: 'Black', ramRgb: false, ramPackage: 'Tray', ramMemoryType: 'DDR4', ramBus: 3200, ramSize: '32GB' },
  { category: 'RAM', name: 'Corsair Vengeance LPX RGB 16GB DDR4 3200MHz (2x8GB)', brand: 'CORSAIR', model: 'VENGEANCE', quantity: 1, costPrice: 1500, sellPrice: 0, note: '', ramColor: 'White', ramRgb: true, ramPackage: 'Box', ramMemoryType: 'DDR4', ramBus: 3200, ramSize: '16GB' },
  { category: 'RAM', name: 'G.SKILL Trident Z5 RGB DDR5 6000MHz 32GB (2x16GB)', brand: 'G.SKILL', model: 'Trident Z5', quantity: 1, costPrice: 8000, sellPrice: 0, note: '', ramColor: 'Black', ramRgb: true, ramPackage: 'Box', ramMemoryType: 'DDR5', ramBus: 6000, ramSize: '32GB' },
  { category: 'RAM', name: 'Kingston FURY Beast DDR5 32GB 5600MHz RGB (2x16GB)', brand: 'Kingston', model: 'FURY Beast', quantity: 1, costPrice: 6000, sellPrice: 0, note: '', ramColor: 'Black', ramRgb: true, ramPackage: 'Box', ramMemoryType: 'DDR5', ramBus: 5600, ramSize: '32GB' },
  { category: 'RAM', name: 'ADATA XPG SPECTRIX D50 DDR4 4133MHz 16GB (2x8GB)', brand: 'ADATA', model: 'XPG SPECTRIX', quantity: 0, costPrice: 0, sellPrice: 0, note: '', ramColor: 'Black', ramRgb: true, ramPackage: 'Box', ramMemoryType: 'DDR4', ramBus: 4133, ramSize: '16GB' },
  { category: 'RAM', name: 'Kingston FURY Renegade DDR5 32GB 6000MHz (2x16GB)', brand: 'Kingston', model: 'FURY Renegade', quantity: 1, costPrice: 6500, sellPrice: 0, note: '', ramColor: 'Black', ramRgb: false, ramPackage: 'Box', ramMemoryType: 'DDR5', ramBus: 6000, ramSize: '32GB' },
  { category: 'RAM', name: 'Corsair Vengeance DDR5 96GB 5600MHz (2x48GB)', brand: 'CORSAIR', model: 'VENGEANCE', quantity: 0, costPrice: 0, sellPrice: 0, note: '', ramColor: 'Black', ramRgb: false, ramPackage: 'Box', ramMemoryType: 'DDR5', ramBus: 5600, ramSize: '96GB' },
  { category: 'RAM', name: 'G.SKILL Trident Z Royal DDR4 4000MHz 32GB (2x16GB)', brand: 'G.SKILL', model: 'Trident Z Royal', quantity: 0, costPrice: 0, sellPrice: 0, note: '', ramColor: 'Gold', ramRgb: false, ramPackage: 'Box', ramMemoryType: 'DDR4', ramBus: 4000, ramSize: '32GB' },
  { category: 'RAM', name: 'Kingston FURY Beast DDR4 3200MHz 16GB (2x8GB)', brand: 'Kingston', model: 'FURY Beast', quantity: 1, costPrice: 1200, sellPrice: 0, note: '', ramColor: 'Black', ramRgb: false, ramPackage: 'Box', ramMemoryType: 'DDR4', ramBus: 3200, ramSize: '16GB' },
  { category: 'RAM', name: 'PNE.T WINPRO DDR4 3200MHz 8GB (1x8GB)', brand: 'PNE.T', model: 'WINPRO', quantity: 2, costPrice: 700, sellPrice: 0, note: '', ramColor: 'Black', ramRgb: false, ramPackage: 'Tray', ramMemoryType: 'DDR4', ramBus: 3200, ramSize: '8GB' },
  { category: 'RAM', name: 'ADATA Premier DDR4 3200MHz 32GB (2x16GB)', brand: 'ADATA', model: 'Premier', quantity: 1, costPrice: 4500, sellPrice: 0, note: '', ramColor: 'Black', ramRgb: false, ramPackage: 'Box', ramMemoryType: 'DDR4', ramBus: 3200, ramSize: '32GB' },
  { category: 'RAM', name: 'Transcend JetRAM DDR4 3200MHz 16GB (2x8GB)', brand: 'Transcend', model: 'JetRAM', quantity: 0, costPrice: 0, sellPrice: 0, note: '', ramColor: 'Black', ramRgb: false, ramPackage: 'Box', ramMemoryType: 'DDR4', ramBus: 3200, ramSize: '16GB' },
  { category: 'RAM', name: 'Crucial Ballistix RGB DDR4 3600MHz 32GB (2x16GB)', brand: 'Crucial', model: 'Ballistix RGB', quantity: 1, costPrice: 5000, sellPrice: 0, note: '', ramColor: 'Black', ramRgb: true, ramPackage: 'Box', ramMemoryType: 'DDR4', ramBus: 3600, ramSize: '32GB' },
  { category: 'RAM', name: 'MSI MPG GUNNY DDR4 3600MHz 16GB (2x8GB)', brand: 'MSI', model: 'MPG GUNNY', quantity: 1, costPrice: 2000, sellPrice: 0, note: '', ramColor: 'Black', ramRgb: true, ramPackage: 'Box', ramMemoryType: 'DDR4', ramBus: 3600, ramSize: '16GB' },
  { category: 'RAM', name: 'Gigabyte AORUS Master DDR5 5600MHz 32GB (2x16GB)', brand: 'Gigabyte', model: 'AORUS Master', quantity: 0, costPrice: 0, sellPrice: 0, note: '', ramColor: 'Black', ramRgb: false, ramPackage: 'Box', ramMemoryType: 'DDR5', ramBus: 5600, ramSize: '32GB' },

  // M.2 - 11 items
  { category: 'M.2', name: 'WD BLUE SN580 PCIe 4.0 NVMe M.2 1TB', brand: 'Western Digital', model: 'Blue SN580', quantity: 1, costPrice: 1400, sellPrice: 0, note: '', m2Package: 'Box', m2Type: 'NVME', m2Interface: 'PCIe 4.0', m2Capacity: '1TB' },
  { category: 'M.2', name: 'HIKSEMI FUTURE PCIe 4.0 NVMe M.2 512GB', brand: 'HIKSEMI', model: 'FUTURE', quantity: 1, costPrice: 700, sellPrice: 0, note: '', m2Package: 'Box', m2Type: 'NVME', m2Interface: 'PCIe 4.0', m2Capacity: '512GB' },
  { category: 'M.2', name: 'SEAGATE FIRECUDA 520  PCIe 4.0 NVMe M.2 500GB', brand: 'SEAGATE', model: 'FireCuda 520', quantity: 0, costPrice: 0, sellPrice: 0, note: '', m2Package: 'Box', m2Type: 'NVME', m2Interface: 'PCIe 4.0', m2Capacity: '500GB' },
  { category: 'M.2', name: 'WD BLACK SN850X  PCIe 4.0 NVMe M.2 2TB', brand: 'Western Digital', model: 'BLACK SN850X', quantity: 1, costPrice: 3500, sellPrice: 0, note: '', m2Package: 'Tray', m2Type: 'NVME', m2Interface: 'PCIe 4.0', m2Capacity: '2TB' },
  { category: 'M.2', name: 'SPATIUM M450 PCIe 4.0 NVMe M.2 500GB', brand: 'MSI', model: 'SPATIUM M450', quantity: 6, costPrice: 7320, sellPrice: 0, note: '', m2Package: 'Box', m2Type: 'NVME', m2Interface: 'PCIe 4.0', m2Capacity: '500GB' },
  { category: 'M.2', name: 'DAHUA SSD M.2 C900 PLUS  3.0 NVMe M.2 256GB', brand: 'DAHUA', model: 'C900 PLUS', quantity: 2, costPrice: 1514, sellPrice: 0, note: '', m2Package: 'Box', m2Type: 'NVME', m2Interface: 'PCIe 3.0', m2Capacity: '256GB' },
  { category: 'M.2', name: 'Ediloca EN206 M.2 SATA III SSD M.2 512GB', brand: 'Ediloca', model: 'EN206', quantity: 1, costPrice: 600, sellPrice: 0, note: '', m2Package: 'Box', m2Type: 'SATA', m2Interface: 'SATA', m2Capacity: '512GB' },
  { category: 'M.2', name: 'Ediloca EN605 M.2 SSD PCle 3.0 M.2 256GB', brand: 'Ediloca', model: 'EN605', quantity: 2, costPrice: 1600, sellPrice: 0, note: '', m2Package: 'Box', m2Type: 'NVME', m2Interface: 'PCIe 3.0', m2Capacity: '256GB' },
  { category: 'M.2', name: 'CRUCIAL P3  PCIe 4.0 NVMe M.2 1TB', brand: 'CRUCIAL', model: 'P3', quantity: 1, costPrice: 2000, sellPrice: 0, note: '', m2Package: 'Tray', m2Type: 'NVME', m2Interface: 'PCIe 4.0', m2Capacity: '1TB' },
  { category: 'M.2', name: 'SK-hynix OEM PCIe 3.0 NVMe M.2 512GB', brand: 'SK-hynix', model: 'OEM', quantity: 1, costPrice: 1000, sellPrice: 0, note: '', m2Package: 'Tray', m2Type: 'NVME', m2Interface: 'PCIe 3.0', m2Capacity: '512GB' },

  // SSD - 5 items
  { category: 'SSD', name: 'WD BLUE SA510 SATA-III  1TB', brand: 'Western Digital', model: 'Blue SA510', quantity: 1, costPrice: 1400, sellPrice: 0, note: '', ssdPackage: 'Box', ssdInterface: 'SATA-III', ssdCapacity: '1TB' },
  { category: 'SSD', name: 'HIKSEMI C100 NEO  SATA-III  240GB', brand: 'HIKSEMI', model: 'C100 NEO', quantity: 2, costPrice: 1500, sellPrice: 0, note: '', ssdPackage: 'Box', ssdInterface: 'SATA-III', ssdCapacity: '240GB' },
  { category: 'SSD', name: 'HIKSEMI WAVE  SATA-III  512GB', brand: 'HIKSEMI', model: 'WAVE', quantity: 0, costPrice: 0, sellPrice: 0, note: '', ssdPackage: 'Tray', ssdInterface: 'SATA-III', ssdCapacity: '512GB' },
  { category: 'SSD', name: 'DAHUA SSD C800A  SATA-III  480GB', brand: 'DAHUA', model: 'C800A', quantity: 1, costPrice: 1000, sellPrice: 0, note: '', ssdPackage: 'Box', ssdInterface: 'SATA-III', ssdCapacity: '480GB' },
  { category: 'SSD', name: 'Ediloca ES106 SATA-III  256GB', brand: 'Ediloca', model: 'ES106', quantity: 2, costPrice: 1600, sellPrice: 0, note: '', ssdPackage: 'Box', ssdInterface: 'SATA-III', ssdCapacity: '256GB' },

  // MAINBOARD - 17 items
  { category: 'MAINBOARD', name: 'AM4 ASUS PRIME B550M-A/CSM', brand: 'ASUS', model: 'PRIME', quantity: 0, costPrice: 0, sellPrice: 0, note: 'มือสอง', mbSize: 'MICRO-ATX', mbSocket: 'AM4', mbChipset: 'B550M', mbSlotRam: 4, mbSupportRam: 'DDR4' },
  { category: 'MAINBOARD', name: 'AM4 ASUS TUF GAMING B550M-PLUS AM4 DDR4', brand: 'ASUS', model: 'TUF GAMING', quantity: 1, costPrice: 2100, sellPrice: 0, note: 'มือสอง', mbSize: 'MICRO-ATX', mbSocket: 'AM4', mbChipset: 'B550M', mbSlotRam: 4, mbSupportRam: 'DDR4' },
  { category: 'MAINBOARD', name: 'AM4 ASUS TUF GAMING A520M-PLUS AM4 DDR4', brand: 'ASUS', model: 'TUF GAMING', quantity: 1, costPrice: 1500, sellPrice: 0, note: 'มือสอง', mbSize: 'MICRO-ATX', mbSocket: 'AM4', mbChipset: 'B550M', mbSlotRam: 2, mbSupportRam: 'DDR4' },
  { category: 'MAINBOARD', name: 'ASUS PRIME A320M-K AM4 DDR4', brand: 'ASUS', model: 'PRIME', quantity: 1, costPrice: 800, sellPrice: 0, note: '', mbSize: 'MICRO-ATX', mbSocket: 'AM4', mbChipset: 'A320M', mbSlotRam: 2, mbSupportRam: 'DDR4' },
  { category: 'MAINBOARD', name: 'ASUS PRIME A520M-K AM4 DDR4', brand: 'ASUS', model: 'PRIME', quantity: 1, costPrice: 1500, sellPrice: 0, note: '', mbSize: 'MICRO-ATX', mbSocket: 'AM4', mbChipset: 'A520M', mbSlotRam: 2, mbSupportRam: 'DDR4' },
  { category: 'MAINBOARD', name: 'MSI A520M-A PRO AM4 DDR4', brand: 'MSI', model: 'A-PRO', quantity: 3, costPrice: 4350, sellPrice: 0, note: '', mbSize: 'MICRO-ATX', mbSocket: 'AM4', mbChipset: 'A520M', mbSlotRam: 2, mbSupportRam: 'DDR4' },
  { category: 'MAINBOARD', name: 'ASUS PRIME H470 PLUS', brand: 'ASUS', model: 'PRIME', quantity: 1, costPrice: 1000, sellPrice: 0, note: 'Intel Gen10-11', mbSize: 'ATX', mbSocket: '1200', mbChipset: 'H470', mbSlotRam: 4, mbSupportRam: 'DDR4' },
  { category: 'MAINBOARD', name: 'ASUS TUF GAMING H570-PRO WIFI DDR4', brand: 'ASUS', model: 'TUF GAMING', quantity: 0, costPrice: 0, sellPrice: 0, note: 'Intel Gen10-11', mbSize: 'ATX', mbSocket: '1200', mbChipset: 'H570', mbSlotRam: 4, mbSupportRam: 'DDR4' },
  { category: 'MAINBOARD', name: 'ASROCK B560M PRO4 DDR4', brand: 'ASROCK', model: 'Pro4', quantity: 0, costPrice: 0, sellPrice: 0, note: 'ส่งซ่อม', mbSize: 'MICRO-ATX', mbSocket: '1200', mbChipset: 'B560M', mbSlotRam: 4, mbSupportRam: 'DDR4' },
  { category: 'MAINBOARD', name: 'BIOSTAR B560MHP R2.0 DDR4', brand: 'BIOSTAR', model: 'B560MHP R2.0', quantity: 1, costPrice: 1500, sellPrice: 0, note: 'มือสอง', mbSize: 'MICRO-ATX', mbSocket: '1200', mbChipset: 'B560M', mbSlotRam: 2, mbSupportRam: 'DDR4' },
  { category: 'MAINBOARD', name: 'MSI B560M PRO-VDH WIFI AM4 DDR4', brand: 'MSI', model: 'B560M', quantity: 0, costPrice: 0, sellPrice: 0, note: '', mbSize: 'MICRO-ATX', mbSocket: '1200', mbChipset: 'B560M', mbSlotRam: 4, mbSupportRam: 'DDR4' },
  { category: 'MAINBOARD', name: 'GIGABYTE B460M AORUS PRO DDR4', brand: 'GIGABYTE', model: 'B460M', quantity: 1, costPrice: 1200, sellPrice: 0, note: '', mbSize: 'MICRO-ATX', mbSocket: '1200', mbChipset: 'B460M', mbSlotRam: 2, mbSupportRam: 'DDR4' },
  { category: 'MAINBOARD', name: 'MSI B450M BAZOOKA V2 AM4 DDR4', brand: 'MSI', model: 'B450M', quantity: 2, costPrice: 1800, sellPrice: 0, note: '', mbSize: 'MICRO-ATX', mbSocket: 'AM4', mbChipset: 'B450M', mbSlotRam: 4, mbSupportRam: 'DDR4' },
  { category: 'MAINBOARD', name: 'ASUS ROG STRIX B550-F GAMING WIFI', brand: 'ASUS', model: 'ROG STRIX', quantity: 1, costPrice: 3500, sellPrice: 0, note: '', mbSize: 'ATX', mbSocket: 'AM4', mbChipset: 'B550', mbSlotRam: 4, mbSupportRam: 'DDR4' },
  { category: 'MAINBOARD', name: 'GIGABYTE X570 I AORUS PRO WIFI', brand: 'GIGABYTE', model: 'X570 I', quantity: 0, costPrice: 0, sellPrice: 0, note: '', mbSize: 'MICRO-ATX', mbSocket: 'AM4', mbChipset: 'X570', mbSlotRam: 2, mbSupportRam: 'DDR4' },
  { category: 'MAINBOARD', name: 'MSI MAG X570-TOMAHAWK WIFI', brand: 'MSI', model: 'MAG X570', quantity: 1, costPrice: 4000, sellPrice: 0, note: '', mbSize: 'ATX', mbSocket: 'AM4', mbChipset: 'X570', mbSlotRam: 4, mbSupportRam: 'DDR4' },

  // VGA - 16 items
  { category: 'VGA', name: 'ZOTAC GAMING GEFORCE RTX 5070 TWIN EDGE OC - 12GB GDDR7', brand: 'ZOTAC', model: 'Twin Edge OC', quantity: 0, costPrice: 0, sellPrice: 0, note: '', vgaChipset: 'Nvidia', vgaFan: 2, vgaSeries: 'GeForce 50 Series', vgaGpuModel: '5070', vgaMemory: 12 },
  { category: 'VGA', name: 'ASUS DUAL GEFORCE RTX 5060 8GB GDDR7 OC EDITION', brand: 'ASUS', model: 'DUAL OC', quantity: 3, costPrice: 27600, sellPrice: 0, note: '', vgaChipset: 'Nvidia', vgaFan: 2, vgaSeries: 'GeForce 50 Series', vgaGpuModel: '5060', vgaMemory: 8 },
  { category: 'VGA', name: 'GIGABYTE GEFORCE RTX 4060 EAGLE OC 8G - 8GB GDDR6', brand: 'GIGABYTE', model: 'EAGLE OC', quantity: 1, costPrice: 7650, sellPrice: 0, note: '', vgaChipset: 'Nvidia', vgaFan: 3, vgaSeries: 'GeForce 40 Series', vgaGpuModel: '4060', vgaMemory: 8 },
  { category: 'VGA', name: 'GALAX GEFORCE RTX 4060 1-CLICK OC 2X V2', brand: 'GALAX', model: '1-Click OC', quantity: 1, costPrice: 7500, sellPrice: 0, note: '', vgaChipset: 'Nvidia', vgaFan: 2, vgaSeries: 'GeForce 40 Series', vgaGpuModel: '4060', vgaMemory: 8 },
  { category: 'VGA', name: 'GALAX GEFORCE RTX 3080 TI SG 1-CLICK OC - 12GB GDDR6X', brand: 'GALAX', model: '1-Click OC', quantity: 1, costPrice: 10700, sellPrice: 0, note: '', vgaChipset: 'Nvidia', vgaFan: 4, vgaSeries: 'GeForce 30 Series', vgaGpuModel: '3080TI', vgaMemory: 12 },
  { category: 'VGA', name: 'ZOTAC GAMING GEFORCE RTX 3050 6GB GDDR6', brand: 'ZOTAC', model: 'Low profile', quantity: 1, costPrice: 4000, sellPrice: 0, note: '', vgaChipset: 'Nvidia', vgaFan: 2, vgaSeries: 'GeForce 30 Series', vgaGpuModel: '3050', vgaMemory: 6 },
  { category: 'VGA', name: 'ASUS TUF RTX3060TI O8G V2 GAMING - 8GB GDDR6', brand: 'ASUS', model: 'TUF GAMING', quantity: 1, costPrice: 6500, sellPrice: 0, note: '', vgaChipset: 'Nvidia', vgaFan: 3, vgaSeries: 'GeForce 30 Series', vgaGpuModel: '3060TI', vgaMemory: 8 },
  { category: 'VGA', name: 'PNY GeForce RTX 2060 12GB', brand: 'PNY', model: 'UPRISING', quantity: 1, costPrice: 4200, sellPrice: 0, note: '', vgaChipset: 'Nvidia', vgaFan: 2, vgaSeries: 'GeForce 20 Series', vgaGpuModel: '2060', vgaMemory: 12 },
  { category: 'VGA', name: 'GALAX GEFORCE RTX 2060 1-CLICK OC- 6GB GDDR6', brand: 'GALAX', model: '1-Click OC', quantity: 1, costPrice: 3500, sellPrice: 0, note: '', vgaChipset: 'Nvidia', vgaFan: 2, vgaSeries: 'GeForce 20 Series', vgaGpuModel: '2060', vgaMemory: 6 },
  { category: 'VGA', name: 'ZOTAC GTX1080TI AMP EDITION 11GB DDR5X', brand: 'ZOTAC', model: 'AMP', quantity: 1, costPrice: 3500, sellPrice: 0, note: '', vgaChipset: 'Nvidia', vgaFan: 2, vgaSeries: 'GeForce 10 Series', vgaGpuModel: '1080TI', vgaMemory: 11 },
  { category: 'VGA', name: 'MSI GEFORCE RTX 2070 SUPER GAMING X 8GB GDDR6', brand: 'MSI', model: 'GAMING X', quantity: 0, costPrice: 0, sellPrice: 0, note: '', vgaChipset: 'Nvidia', vgaFan: 3, vgaSeries: 'GeForce 20 Series', vgaGpuModel: '2070 Super', vgaMemory: 8 },
  { category: 'VGA', name: 'SAPPHIRE NITRO+ RX 6700 XT 12GB GDDR6', brand: 'Sapphire', model: 'NITRO+', quantity: 0, costPrice: 0, sellPrice: 0, note: '', vgaChipset: 'AMD', vgaFan: 3, vgaSeries: 'RDNA 2', vgaGpuModel: '6700 XT', vgaMemory: 12 },
  { category: 'VGA', name: 'ASUS ROG STRIX RTX 3070 O8G V2 GAMING 8GB GDDR6', brand: 'ASUS', model: 'ROG STRIX', quantity: 2, costPrice: 7000, sellPrice: 0, note: '', vgaChipset: 'Nvidia', vgaFan: 3, vgaSeries: 'GeForce 30 Series', vgaGpuModel: '3070', vgaMemory: 8 },
  { category: 'VGA', name: 'MSI RTX 3060 TI VENTUS 2X 8GB OC', brand: 'MSI', model: 'VENTUS', quantity: 1, costPrice: 5500, sellPrice: 0, note: '', vgaChipset: 'Nvidia', vgaFan: 2, vgaSeries: 'GeForce 30 Series', vgaGpuModel: '3060 TI', vgaMemory: 8 },

  // PSU - 7 items
  { category: 'PSU', name: 'THERMALTAKE M1650 - 1650W 80 PLUS Bronze', brand: 'THERMALTAKE', model: 'M1650', quantity: 3, costPrice: 2700, sellPrice: 0, note: 'มือสอง', psuCertification: '80 PLUS Bronze', psuWatt: 1650 },
  { category: 'PSU', name: 'DARKFLASH GS 850M 850W 80 PLUS Bronze', brand: 'DARKFLASH', model: 'GS850M', quantity: 1, costPrice: 1500, sellPrice: 0, note: '', psuCertification: '80 PLUS Bronze', psuWatt: 850 },
  { category: 'PSU', name: 'Einarex AXIS MASTER  PSU 850W 80 PLUS Bronze', brand: 'Einarex', model: 'Axis Master', quantity: 1, costPrice: 1500, sellPrice: 0, note: '', psuCertification: '80 PLUS Bronze', psuWatt: 850 },
  { category: 'PSU', name: 'Einarex AXIS MASTER  PSU 750W  80 PLUS Bronze', brand: 'Einarex', model: 'Axis Master', quantity: 1, costPrice: 1500, sellPrice: 0, note: '', psuCertification: '80 PLUS Bronze', psuWatt: 750 },
  { category: 'PSU', name: 'GIGABYTE P750GM PSU 750W 80 PLUS GOLD', brand: 'GIGABYTE', model: 'P750GM', quantity: 1, costPrice: 1500, sellPrice: 0, note: '', psuCertification: '80 PLUS GOLD', psuWatt: 750 },
  { category: 'PSU', name: 'COOLER MASTER MWE 750 WHITE 230V- V2 PSU 750W 80 PLUS', brand: 'COOLER MASTER', model: 'MWE750', quantity: 1, costPrice: 1200, sellPrice: 0, note: '', psuCertification: '80 PLUS WHITE', psuWatt: 750 },
  { category: 'PSU', name: 'PSU 650W 80+ AXIS MASTER', brand: 'Einarex', model: 'Axis Master', quantity: 2, costPrice: 2000, sellPrice: 0, note: '', psuCertification: '80 PLUS Bronze', psuWatt: 650 },

  // Monitor - 4 items
  { category: 'Monitor', name: 'MSI Pro MP251 E2 - 24.5 Inch IPS FHD 120Hz Adaptive Sync', brand: 'MSI', model: 'Pro MP251 E2', quantity: 1, costPrice: 2200, sellPrice: 0, note: '', monitorSize: 25, monitorColor: 'Black', monitorPanel: 'IPS', monitorRes: 'FHD', monitorHz: 120 },
  { category: 'Monitor', name: 'MSI Pro MP251 E2 - 24.5 Inch IPS FHD 120Hz Adaptive Sync', brand: 'MSI', model: 'Pro MP251 E2', quantity: 1, costPrice: 2200, sellPrice: 0, note: '', monitorSize: 25, monitorColor: 'White', monitorPanel: 'IPS', monitorRes: 'FHD', monitorHz: 120 },
  { category: 'Monitor', name: 'AOC 22B30HM2-120/67 - 21.5 Inch VA FHD 120Hz ADAPTIVE SYNC', brand: 'AOC', model: '22B30HM2', quantity: 3, costPrice: 4650, sellPrice: 0, note: '', monitorSize: 22, monitorColor: 'Black', monitorPanel: 'VA', monitorRes: 'FHD', monitorHz: 120 },
  { category: 'Monitor', name: 'Dahua DHI LM27-E230CN - 27 Inch VA FHD 180Hz Curved', brand: 'Dahua', model: 'LM27-E230CN', quantity: 1, costPrice: 2500, sellPrice: 0, note: '', monitorSize: 27, monitorColor: 'Black', monitorPanel: 'VA', monitorRes: 'FHD', monitorHz: 180 },
]

async function main() {
  console.log('Seeding database...')

  // Delete in correct order (respect foreign keys)
  await prisma.payment.deleteMany({})
  await prisma.setItem.deleteMany({})
  await prisma.customerSet.deleteMany({})
  await prisma.part.deleteMany({})

  // Insert new parts
  for (const part of seedParts) {
    await prisma.part.create({
      data: part as any,
    })
  }

  console.log(`Seeded ${seedParts.length} parts`)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
