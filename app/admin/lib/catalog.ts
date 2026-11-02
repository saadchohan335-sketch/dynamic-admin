type OptionMap = Record<string, readonly string[]>;

const extraCategoriesByType: OptionMap = {
  "3D Scanners": ["Desktop 3D Scanners", "Handheld Scanners", "Portable CMMs"],
  "3D Softwares": ["Design Software", "Inspection Software", "Scanning Software"],
  "Engineering Computers": ["Laptops", "Servers", "Workstations"],
  Accessories: [
    "Bags & Cases",
    "Cables",
    "Chargers & Power",
    "Cleaning Kits",
    "Memory Cards",
    "Screen Protectors",
    "Stands & Mounts",
  ],
  "Audio & Video": [
    "Headphones",
    "Home Theater",
    "Microphones",
    "Projectors",
    "Speakers",
    "Televisions",
  ],
  Cameras: [
    "Action Cameras",
    "Camera Accessories",
    "Camera Lenses",
    "Digital Cameras",
    "Drones",
    "Security Cameras",
  ],
  Computers: [
    "Components",
    "Desktops",
    "Laptops",
    "Monitors",
    "Peripherals",
    "Printers & Scanners",
    "Servers",
  ],
  Electronics: [
    "Batteries & Chargers",
    "Cables & Adapters",
    "Power Equipment",
    "Smart Devices",
    "Storage Devices",
    "Wearables",
  ],
  Gaming: [
    "Consoles",
    "Game Titles",
    "Gaming Accessories",
    "Gaming PCs",
    "Virtual Reality",
  ],
  "Home Appliances": [
    "Cleaning Appliances",
    "Cooling & Heating",
    "Kitchen Appliances",
    "Laundry",
    "Personal Care",
    "Smart Home",
  ],
  "Mobile Phones": [
    "Feature Phones",
    "Mobile Accessories",
    "Smart Watches",
    "Smartphones",
    "Tablets",
  ],
  Networking: [
    "Modems",
    "Network Cables",
    "Network Security",
    "Routers",
    "Switches",
    "Wireless Access Points",
  ],
};

const extraSubCategoriesByCategory: OptionMap = {
  "Action Cameras": ["4K Action Cameras", "Waterproof Cameras", "360° Cameras"],
  "Bags & Cases": ["Camera Bags", "Laptop Bags", "Phone Cases", "Protective Cases"],
  Cables: ["Audio Cables", "HDMI Cables", "USB Cables"],
  "Cables & Adapters": ["Adapters", "Extension Cables", "USB Hubs"],
  "Camera Accessories": ["Batteries", "Filters", "Tripods"],
  "Camera Lenses": ["Prime Lenses", "Telephoto Lenses", "Wide-Angle Lenses", "Zoom Lenses"],
  "Chargers & Power": ["Car Chargers", "Power Banks", "Wall Chargers", "Wireless Chargers"],
  "Cleaning Appliances": ["Air Purifiers", "Robot Vacuums", "Vacuum Cleaners"],
  "Cleaning Kits": ["Lens Cleaning Kits", "Screen Cleaning Kits"],
  Components: ["Graphics Cards", "Memory (RAM)", "Motherboards", "Power Supplies", "Processors", "Storage Drives"],
  "Cooling & Heating": ["Air Conditioners", "Fans", "Heaters", "Water Dispensers"],
  Consoles: ["Handheld Consoles", "Home Consoles"],
  "Desktop 3D Scanners": ["Dental Scanners", "Structured Light Scanners"],
  Desktops: ["All-in-One PCs", "Mini PCs", "Tower PCs"],
  "Digital Cameras": ["DSLR Cameras", "Instant Cameras", "Mirrorless Cameras", "Point & Shoot Cameras"],
  Drones: ["Camera Drones", "Racing Drones", "Drone Accessories"],
  "Feature Phones": ["Basic Phones", "Rugged Phones"],
  "Game Titles": ["Action", "Adventure", "Sports", "Strategy"],
  "Gaming Accessories": ["Controllers", "Gaming Chairs", "Gaming Headsets", "Gaming Keyboards", "Gaming Mice"],
  "Gaming PCs": ["Gaming Desktops", "Gaming Laptops"],
  Headphones: ["Earbuds", "Noise-Cancelling Headphones", "On-Ear Headphones", "Over-Ear Headphones", "Wireless Headphones"],
  "Home Theater": ["AV Receivers", "Soundbars", "Subwoofers"],
  "Kitchen Appliances": ["Blenders", "Microwave Ovens", "Refrigerators", "Toasters", "Electric Kettles"],
  Laptops: ["2-in-1 Laptops", "Business Laptops", "Gaming Laptops", "Student Laptops", "Ultrabooks"],
  Laundry: ["Dryers", "Washing Machines"],
  "Memory Cards": ["CF Cards", "microSD Cards", "SD Cards"],
  Microphones: ["Condenser Microphones", "Lavalier Microphones", "USB Microphones"],
  Modems: ["Cable Modems", "DSL Modems", "Fiber Modems"],
  "Mobile Accessories": ["Phone Cases", "Phone Chargers", "Phone Holders", "Screen Protectors"],
  Monitors: ["Curved Monitors", "Gaming Monitors", "Professional Monitors", "Ultrawide Monitors"],
  "Network Cables": ["Cat6 Cables", "Cat7 Cables", "Fiber Optic Cables"],
  "Network Security": ["Firewalls", "VPN Appliances"],
  "Personal Care": ["Hair Dryers", "Hair Straighteners", "Shavers", "Trimmers"],
  Peripherals: ["Keyboards", "Mice", "Webcams"],
  "Portable CMMs": ["Optical CMMs", "Arm CMMs"],
  "Power Equipment": ["Generators", "Inverters", "Solar Panels", "UPS Systems"],
  "Printers & Scanners": ["Document Scanners", "Inkjet Printers", "Laser Printers", "Photo Printers"],
  Projectors: ["Business Projectors", "Home Projectors", "Portable Projectors"],
  Routers: ["Gaming Routers", "Mesh Routers", "Wi-Fi Routers"],
  "Screen Protectors": ["Privacy Protectors", "Tempered Glass"],
  "Security Cameras": ["Dome Cameras", "IP Cameras", "Wireless Cameras"],
  Servers: ["Rack Servers", "Tower Servers"],
  "Smart Devices": ["Smart Bulbs", "Smart Plugs", "Smart Speakers"],
  "Smart Home": ["Smart Locks", "Smart Thermostats", "Video Doorbells"],
  "Smart Watches": ["Fitness Bands", "Kids Watches", "Smart Watches"],
  Smartphones: ["Android Phones", "Foldable Phones", "Gaming Phones", "iPhones"],
  Speakers: ["Bluetooth Speakers", "Bookshelf Speakers", "Smart Speakers"],
  "Stands & Mounts": ["Laptop Stands", "Monitor Mounts", "Phone Stands", "TV Wall Mounts"],
  "Storage Devices": ["External Hard Drives", "Flash Drives", "NAS Devices", "Solid State Drives"],
  Switches: ["Managed Switches", "PoE Switches", "Unmanaged Switches"],
  Tablets: ["Android Tablets", "Drawing Tablets", "iPads", "Kids Tablets"],
  Televisions: ["4K TVs", "8K TVs", "LED TVs", "OLED TVs", "Smart TVs"],
  "Virtual Reality": ["VR Accessories", "VR Headsets"],
  Wearables: ["Fitness Trackers", "Smart Glasses", "Smart Rings"],
  "Wireless Access Points": ["Indoor Access Points", "Outdoor Access Points"],
  Workstations: ["Mobile Workstations", "Tower Workstations"],
};

function mergeMaps(base: OptionMap, extra: OptionMap): Record<string, string[]> {
  const keys = new Set<string>([...Object.keys(base), ...Object.keys(extra)]);
  const result: Record<string, string[]> = {};

  Array.from(keys)
    .sort((a, b) => a.localeCompare(b))
    .forEach((key) => {
      const seen = new Set<string>();
      const merged: string[] = [];
      [...(base[key] ?? []), ...(extra[key] ?? [])].forEach((item) => {
        const id = item.toLowerCase();
        if (!seen.has(id)) {
          seen.add(id);
          merged.push(item);
        }
      });
      result[key] = merged.sort((a, b) => a.localeCompare(b));
    });

  return result;
}

export function buildCatalog(
  baseCategories: OptionMap,
  baseSubCategories: OptionMap
) {
  return {
    categoriesByType: mergeMaps(baseCategories, extraCategoriesByType),
    subCategoriesByCategory: mergeMaps(
      baseSubCategories,
      extraSubCategoriesByCategory
    ),
  };
}

export function findKey(
  map: Record<string, string[]>,
  value: string
): string | undefined {
  const v = value.trim().toLowerCase();
  if (!v) return undefined;
  return Object.keys(map).find((k) => k.toLowerCase() === v);
}