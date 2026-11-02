export type ProductImage = {
  name: string;
  dataUrl: string;
};

export type Product = {
  id: string;
  productType: string;
  category: string;
  subCategory: string;
  title: string;
  slug: string;
  seriesName: string;
  description: string;
  ctaHeading?: string;
  ctaDescription?: string;
  price?: number | null;
 
  accordions?: {
    title: string;
    content: string;
  }[];
  carouselImages?: ProductImage[];
  status: "draft" | "published";
};

export const categoriesByType: Record<string, string[]> = {
  "3D Scanners": ["Handheld Scanners", "Desktop Scanners"],
  "3D Softwares": ["Design Software", "Scanning Software"],
  "Engineering Computers": ["Workstations", "Laptops"],
  Accessories: ["Cables", "Scanner Accessories"],
};

export const subCategoriesByCategory: Record<string, string[]> = {
  "Handheld Scanners": ["Portable", "Professional"],
  "Desktop Scanners": ["Small Objects", "Industrial"],
  "Design Software": ["CAD", "3D Modeling"],
  "Scanning Software": ["Reverse Engineering", "Inspection"],
  Workstations: ["Desktop Workstations", "Tower Workstations"],
  Laptops: ["Mobile Workstations", "Engineering Laptops"],
  Cables: ["USB Cables", "Power Cables"],
  "Scanner Accessories": ["Tripods", "Calibration Tools"],
};

export const STORAGE_KEY = "products";