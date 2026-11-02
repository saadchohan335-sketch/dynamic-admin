"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, type ChangeEvent } from "react";
import {
  type Product,
  type ProductImage,
  STORAGE_KEY,
  categoriesByType,
  subCategoriesByCategory,
} from "../lib/products";
import { buildCatalog, findKey } from "../lib/catalog";
import "../admin.css";

type AccordionItem = {
  title: string;
  content: string;
};

const CUSTOM = "__custom__";
const catalog = buildCatalog(categoriesByType, subCategoriesByCategory);

function readFileAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") resolve(reader.result);
      else reject(new Error("Unable to read file."));
    };
    reader.onerror = () => reject(new Error("Unable to read file."));
    reader.readAsDataURL(file);
  });
}

// Saved value ko dropdown option ya custom mein badalta hai
function pickOption(options: string[], value: string) {
  const match = options.find(
    (o) => o.toLowerCase() === value.trim().toLowerCase()
  );
  return match
    ? { sel: match, custom: "" }
    : { sel: value.trim() ? CUSTOM : "", custom: value };
}

const backLinkStyle = {
  textAlign: "left" as const,
  background: "none",
  border: "none",
  padding: 0,
  cursor: "pointer",
  color: "#7c22ff",
};

export default function AddProductPage() {
  const router = useRouter();

  const [editId, setEditId] = useState<string | null>(null);
  const [editMissing, setEditMissing] = useState(false);
  const [currentStatus, setCurrentStatus] = useState<
    Product["status"] | null
  >(null);

  const [typeSel, setTypeSel] = useState("");
  const [typeCustom, setTypeCustom] = useState("");
  const [catSel, setCatSel] = useState("");
  const [catCustom, setCatCustom] = useState("");
  const [subSel, setSubSel] = useState("");
  const [subCustom, setSubCustom] = useState("");

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [seriesName, setSeriesName] = useState("");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState("");

  const [ctaHeading, setCtaHeading] = useState("");
  const [ctaDescription, setCtaDescription] = useState("");
  const [price, setPrice] = useState("");
  const [accordions, setAccordions] = useState<AccordionItem[]>([]);
  const [carouselImages, setCarouselImages] = useState<ProductImage[]>([]);
  const [uploading, setUploading] = useState(false);

  // URL mein ?edit=ID ho to us product ka data form mein bharo
  function resetForm() {
    setEditId(null);
    setEditMissing(false);
    setCurrentStatus(null);
    setMessage("");
    setTypeSel("");
    setTypeCustom("");
    setCatSel("");
    setCatCustom("");
    setSubSel("");
    setSubCustom("");
    setTitle("");
    setSlug("");
    setSeriesName("");
    setDescription("");
    setCtaHeading("");
    setCtaDescription("");
    setPrice("");
    setAccordions([]);
    setCarouselImages([]);
  }

  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get("edit");

    // Add Product mode: purana edit data saaf karo
    if (!id) {
      resetForm();
      return;
    }

    setEditId(id);

    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      const list: Product[] = saved ? JSON.parse(saved) : [];
      const p = list.find((item) => item.id === id);

      if (!p) {
        setEditMissing(true);
        return;
      }

      const tKey = findKey(catalog.categoriesByType, p.productType);
      const t = pickOption(
        Object.keys(catalog.categoriesByType),
        tKey ?? p.productType
      );
      setTypeSel(t.sel);
      setTypeCustom(t.custom);

      const catList = tKey ? catalog.categoriesByType[tKey] : [];
      const c = pickOption(catList, p.category);
      setCatSel(c.sel);
      setCatCustom(c.custom);

      const cKey = findKey(catalog.subCategoriesByCategory, p.category);
      const subList = cKey ? catalog.subCategoriesByCategory[cKey] : [];
      const s = pickOption(subList, p.subCategory);
      setSubSel(s.sel);
      setSubCustom(s.custom);

      setCurrentStatus(p.status);
      setTitle(p.title ?? "");
      setSlug(p.slug ?? "");
      setSeriesName(p.seriesName ?? "");
      setDescription(p.description ?? "");
      setCtaHeading(p.ctaHeading ?? "");
      setCtaDescription(p.ctaDescription ?? "");
      setPrice(typeof p.price === "number" ? String(p.price) : "");
      setAccordions(
        (p.accordions ?? []).map((a) => ({
          title: a.title,
          content: a.content,
        }))
      );
      setCarouselImages(p.carouselImages ?? []);
    } catch {
      setEditMissing(true);
    }
  }, []);

  const productType = (typeSel === CUSTOM ? typeCustom : typeSel).trim();
  const category = (catSel === CUSTOM ? catCustom : catSel).trim();
  const subCategory = (subSel === CUSTOM ? subCustom : subSel).trim();

  const typeKey = findKey(catalog.categoriesByType, productType);
  const categoryOptions = typeKey ? catalog.categoriesByType[typeKey] : [];
  const categoryKey = findKey(catalog.subCategoriesByCategory, category);
  const subCategoryOptions = categoryKey
    ? catalog.subCategoriesByCategory[categoryKey]
    : [];

  function removeCarouselImage(index: number) {
    setCarouselImages((current) => current.filter((_, i) => i !== index));
  }

  function updateAccordion(
    index: number,
    field: keyof AccordionItem,
    value: string
  ) {
    setAccordions((current) =>
      current.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      )
    );
  }

  async function handleCarouselImagesChange(
    e: ChangeEvent<HTMLInputElement>
  ) {
    const input = e.currentTarget;
    const files = Array.from(input.files ?? []);
    input.value = "";

    if (!files.length) return;
    setMessage("");

    if (files.some((file) => !file.type.startsWith("image/"))) {
      setMessage("Please select image files only.");
      return;
    }

    setUploading(true);

    try {
      const selectedImages = await Promise.all(
        files.map(async (file) => ({
          name: file.name,
          dataUrl: await readFileAsDataURL(file),
        }))
      );

      setCarouselImages((current) => [...current, ...selectedImages]);
    } catch {
      setMessage("Images could not be read. Please try again.");
    } finally {
      setUploading(false);
    }
  }

  function saveProduct(status: Product["status"]) {
    setMessage("");

    if (uploading) {
      setMessage("Please wait until image processing finishes.");
      return;
    }

    if (
      !productType ||
      !category ||
      !subCategory ||
      !title.trim() ||
      !slug.trim() ||
      !seriesName.trim() ||
      !description.trim()
    ) {
      setMessage("Please fill in all required fields.");
      return;
    }

    if (
      price.trim() !== "" &&
      (!Number.isFinite(Number(price)) || Number(price) < 0)
    ) {
      setMessage("Price cannot be negative or invalid.");
      return;
    }

    if (ctaDescription.length > 256) {
      setMessage("CTA Description cannot exceed 256 characters.");
      return;
    }

    if (
      accordions.some(
        (item) => !item.title.trim() || !item.content.trim()
      )
    ) {
      setMessage("Please complete every accordion title and content.");
      return;
    }

    const cleanSlug = slug
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9-]+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");

    if (!cleanSlug) {
      setMessage("Please enter a valid URL slug.");
      return;
    }

    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      const products: Product[] = saved ? JSON.parse(saved) : [];

      if (
        products.some(
          (p) => p.slug.toLowerCase() === cleanSlug && p.id !== editId
        )
      ) {
        setMessage("This slug is already in use.");
        return;
      }

      const fields = {
        productType,
        category,
        subCategory,
        title: title.trim(),
        slug: cleanSlug,
        seriesName: seriesName.trim(),
        description: description.trim(),
        ctaHeading: ctaHeading.trim(),
        ctaDescription: ctaDescription.trim(),
        price: price.trim() === "" ? null : Number(price),
        accordions: accordions.map((item) => ({
          title: item.title.trim(),
          content: item.content.trim(),
        })),
        carouselImages,
        status,
      };

      // Edit mode: wahi product update (id wahi rahegi)
      if (editId) {
        const updated = products.map((p) =>
          p.id === editId ? ({ ...p, ...fields } as Product) : p
        );
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        router.push("/admin/products");
        return;
      }

      const newProduct: Product = {
        id: crypto.randomUUID(),
        ...fields,
      };

      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify([...products, newProduct])
      );

      setMessage(
        status === "published"
          ? "Product successfully published!"
          : "Product draft successfully saved!"
      );

      setTypeSel("");
      setTypeCustom("");
      setCatSel("");
      setCatCustom("");
      setSubSel("");
      setSubCustom("");
      setTitle("");
      setSlug("");
      setSeriesName("");
      setDescription("");
      setCtaHeading("");
      setCtaDescription("");
      setPrice("");
        setAccordions([]);
      setCarouselImages([]);

      const imageInput =
        document.querySelector<HTMLInputElement>("#carouselImages");
      if (imageInput) imageInput.value = "";
    } catch {
      setMessage(
        "Product could not be saved. Browser storage may be full; try smaller images."
      );
    }
  }

  return (
    <main className="admin-page">
      <div className="admin-container">
        <Link href="/admin/products" className="admin-home-button">
          ← Back to Products
        </Link>

        <header className="admin-header">
          <h1>{editId ? "Edit Product" : "Add Product"}</h1>
          <p>
            {editId
              ? "Update this product and save your changes."
              : "Create a new product or save it as a draft."}
          </p>
        </header>

        {editId && currentStatus && (
          <p style={{ margin: "0 0 16px" }}>
            Current Status:{" "}
            <span
              className={`pl-status ${
                currentStatus === "published"
                  ? "pl-status-pub"
                  : "pl-status-draft"
              }`}
            >
              <span className="pl-dot" />
              {currentStatus === "published" ? "Published" : "Draft"}
            </span>
          </p>
        )}

        {editMissing && (
          <div className="admin-message" role="status">
            Product not found. It may have been deleted.
          </div>
        )}

        {message && (
          <div className="admin-message" role="status">
            {message}
          </div>
        )}

        <form className="admin-form" onSubmit={(e) => e.preventDefault()}>
          <section className="admin-section">
            <h2>Product Classification</h2>
            <div className="classification-fields">
              <div className="admin-field">
                <label htmlFor="productType">Product Type *</label>
                {typeSel === CUSTOM ? (
                  <input
                    id="productType"
                    value={typeCustom}
                    autoFocus
                    onChange={(e) => {
                      setTypeCustom(e.target.value);
                      setCatSel("");
                      setCatCustom("");
                      setSubSel("");
                      setSubCustom("");
                    }}
                    placeholder="Type custom product type"
                  />
                ) : (
                  <select
                    id="productType"
                    value={typeSel}
                    onChange={(e) => {
                      setTypeSel(e.target.value);
                      setTypeCustom("");
                      setCatSel("");
                      setCatCustom("");
                      setSubSel("");
                      setSubCustom("");
                    }}
                  >
                    <option value="">Select product type</option>
                    {Object.keys(catalog.categoriesByType).map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                    <option value={CUSTOM}>+ Type custom...</option>
                  </select>
                )}
                {typeSel === CUSTOM && (
                  <button
                    type="button"
                    className="character-count"
                    style={backLinkStyle}
                    onClick={() => {
                      setTypeSel("");
                      setTypeCustom("");
                      setCatSel("");
                      setCatCustom("");
                      setSubSel("");
                      setSubCustom("");
                    }}
                  >
                    ← Back to list
                  </button>
                )}
              </div>

              <div className="admin-field">
                <label htmlFor="category">Category *</label>
                {catSel === CUSTOM ? (
                  <input
                    id="category"
                    value={catCustom}
                    autoFocus
                    onChange={(e) => {
                      setCatCustom(e.target.value);
                      setSubSel("");
                      setSubCustom("");
                    }}
                    placeholder="Type custom category"
                  />
                ) : (
                  <select
                    id="category"
                    value={catSel}
                    disabled={!productType}
                    onChange={(e) => {
                      setCatSel(e.target.value);
                      setCatCustom("");
                      setSubSel("");
                      setSubCustom("");
                    }}
                  >
                    <option value="">Select category</option>
                    {categoryOptions.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                    <option value={CUSTOM}>+ Type custom...</option>
                  </select>
                )}
                {catSel === CUSTOM && (
                  <button
                    type="button"
                    className="character-count"
                    style={backLinkStyle}
                    onClick={() => {
                      setCatSel("");
                      setCatCustom("");
                      setSubSel("");
                      setSubCustom("");
                    }}
                  >
                    ← Back to list
                  </button>
                )}
              </div>

              <div className="admin-field">
                <label htmlFor="subCategory">Sub-Category *</label>
                {subSel === CUSTOM ? (
                  <input
                    id="subCategory"
                    value={subCustom}
                    autoFocus
                    onChange={(e) => setSubCustom(e.target.value)}
                    placeholder="Type custom sub-category"
                  />
                ) : (
                  <select
                    id="subCategory"
                    value={subSel}
                    disabled={!category}
                    onChange={(e) => {
                      setSubSel(e.target.value);
                      setSubCustom("");
                    }}
                  >
                    <option value="">Select sub-category</option>
                    {subCategoryOptions.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                    <option value={CUSTOM}>+ Type custom...</option>
                  </select>
                )}
                {subSel === CUSTOM && (
                  <button
                    type="button"
                    className="character-count"
                    style={backLinkStyle}
                    onClick={() => {
                      setSubSel("");
                      setSubCustom("");
                    }}
                  >
                    ← Back to list
                  </button>
                )}
              </div>
            </div>
          </section>

          <hr className="admin-divider" />

          <section className="admin-section">
            <h2>Basic Information</h2>
            <div className="basic-fields">
              <div className="admin-field">
                <label htmlFor="title">Product Title *</label>
                <input
                  id="title"
                  value={title}
                  onChange={(e) => {
                    const value = e.target.value;
                    setTitle(value);
                    // Edit mode mein slug khud nahi badalta
                    if (!editId) {
                      setSlug(
                        value
                          .toLowerCase()
                          .trim()
                          .replace(/[^a-z0-9\s-]/g, "")
                          .replace(/\s+/g, "-")
                          .replace(/-+/g, "-")
                          .replace(/^-|-$/g, "")
                      );
                    }
                  }}
                  placeholder="Enter product title"
                  required
                />
              </div>

              <div className="admin-field">
                <label htmlFor="slug">Slug *</label>
                <input
                  id="slug"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="e.g. professional-3d-scanner"
                  required
                />
              </div>

              <div className="admin-field">
                <label htmlFor="seriesName">Series Name *</label>
                <input
                  id="seriesName"
                  value={seriesName}
                  onChange={(e) => setSeriesName(e.target.value)}
                  placeholder="Enter series name"
                  required
                />
              </div>

              <div className="admin-field">
                <label htmlFor="description">Product Description *</label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter product description"
                  maxLength={50000}
                  rows={6}
                  required
                />
                <p className="character-count">
                  {description.length} / 50000 characters
                </p>
              </div>
            </div>
          </section>

          <hr className="admin-divider" />

          <section className="admin-section">
            <h2>Call To Action (CTA)</h2>
            <div className="basic-fields">
              <div className="admin-field">
                <label htmlFor="ctaHeading">CTA Heading</label>
                <input
                  id="ctaHeading"
                  value={ctaHeading}
                  onChange={(e) => setCtaHeading(e.target.value)}
                  placeholder="Enter CTA heading"
                />
              </div>

              <div className="admin-field">
                <label htmlFor="ctaDescription">CTA Description</label>
                <textarea
                  id="ctaDescription"
                  value={ctaDescription}
                  onChange={(e) => setCtaDescription(e.target.value)}
                  placeholder="Encourage customers to book a demo"
                  maxLength={256}
                  rows={3}
                />
                <p className="character-count">
                  {ctaDescription.length} / 256 characters
                </p>
              </div>
            </div>
          </section>

          <hr className="admin-divider" />

          <section className="admin-section">
            <h2>Pricing</h2>
            <div className="basic-fields">
              <div className="admin-field">
                <label htmlFor="price">Price</label>
                <input
                  id="price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="Enter price (optional)"
                />
              </div>

            </div>
          </section>

          <hr className="admin-divider" />

          <section className="admin-section">
            <h2>Accordion Content</h2>
            <p>Add custom sections for additional product information.</p>

            {accordions.map((item, index) => (
              <div key={index} className="admin-section">
                <h3>Accordion {index + 1}</h3>
                <div className="basic-fields">
                  <div className="admin-field">
                    <label htmlFor={`accordion-title-${index}`}>
                      Accordion Title
                    </label>
                    <input
                      id={`accordion-title-${index}`}
                      value={item.title}
                      onChange={(e) =>
                        updateAccordion(index, "title", e.target.value)
                      }
                      placeholder="Enter section heading"
                    />
                  </div>

                  <div className="admin-field">
                    <label htmlFor={`accordion-content-${index}`}>
                      Accordion Content
                    </label>
                    <textarea
                      id={`accordion-content-${index}`}
                      value={item.content}
                      onChange={(e) =>
                        updateAccordion(index, "content", e.target.value)
                      }
                      placeholder="Enter section content"
                      rows={4}
                    />
                  </div>
                </div>
              </div>
            ))}

            <button
              type="button"
              className="save-draft-button"
              onClick={() =>
                setAccordions((current) => [
                  ...current,
                  { title: "", content: "" },
                ])
              }
            >
              + Add Accordion
            </button>
          </section>

          <hr className="admin-divider" />

          <section className="admin-section">
            <h2>Carousel Images</h2>
            <div className="basic-fields">
              <div className="admin-field">
                <label htmlFor="carouselImages">Choose Product Pictures</label>
                <input
                  id="carouselImages"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleCarouselImagesChange}
                  disabled={uploading}
                />

                <p className="character-count" style={{ textAlign: "left" }}>
                  Browse se apne computer se ek ya multiple images select karo.
                </p>

                {carouselImages.length > 0 && (
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "12px",
                      marginTop: "12px",
                    }}
                  >
                    {carouselImages.map((image, index) => (
                      <div
                        key={`${image.name}-${index}`}
                        style={{
                          width: "100px",
                          overflowWrap: "anywhere",
                          fontSize: "12px",
                          color: "#6b7280",
                        }}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={image.dataUrl}
                          alt={image.name}
                          style={{
                            width: "100px",
                            height: "80px",
                            objectFit: "cover",
                            borderRadius: "8px",
                            border: "1px solid #e5e7eb",
                            display: "block",
                            marginBottom: "6px",
                          }}
                        />
                        <span>{image.name}</span>
                        <button
                          type="button"
                          onClick={() => removeCarouselImage(index)}
                          style={{
                            display: "block",
                            marginTop: "6px",
                            padding: "4px 10px",
                            border: "1px solid #dc2626",
                            borderRadius: "6px",
                            background: "#ffffff",
                            color: "#dc2626",
                            fontSize: "12px",
                            fontWeight: 600,
                            cursor: "pointer",
                          }}
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </section>

          {uploading && (
            <p className="character-count" style={{ textAlign: "left" }}>
              Reading selected pictures...
            </p>
          )}

          <div className="admin-actions">
            <button
              type="button"
              className="save-draft-button"
              onClick={() => saveProduct("draft")}
              disabled={uploading}
            >
              Save Draft
            </button>
            <button
              type="button"
              className="publish-button"
              onClick={() => saveProduct("published")}
              disabled={uploading}
            >
              Publish Product
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}