
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Product, STORAGE_KEY } from "../../lib/products";

type ProductImage = {
  dataUrl?: string;
  url?: string;
};

export default function ProductDetails({ slug }: { slug: string }) {
  const [product, setProduct] = useState<Product | null>(null);
  const [images, setImages] = useState<ProductImage[]>([]);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      const products: Product[] = saved ? JSON.parse(saved) : [];

      const found = products.find(
        (item) => item.slug === decodeURIComponent(slug)
      );

      if (found) {
        setProduct(found);

        const item = found as Product & {
          carouselImages?: ProductImage[];
        };

        setImages(item.carouselImages || []);
      } else {
        setNotFound(true);
      }
    } catch {
      setNotFound(true);
    }
  }, [slug]);

  function updateField(field: keyof Product, value: string) {
    if (!product) return;
    setProduct({ ...product, [field]: value } as Product);
  }

  function handleImage(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);

    files.forEach((file) => {
      if (!file.type.startsWith("image/")) return;

      const reader = new FileReader();

      reader.onload = () => {
        setImages((prev) => [
          ...prev,
          { dataUrl: reader.result as string },
        ]);
      };

      reader.readAsDataURL(file);
    });

    e.target.value = "";
  }

  function removeImage(index: number) {
    setImages((prev) => prev.filter((_, i) => i !== index));
  }

  function saveChanges() {
    if (!product) return;

    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      const products: Product[] = saved ? JSON.parse(saved) : [];

      const updatedProduct = {
        ...product,
        carouselImages: images,
      } as Product;

      const updated = products.map((p) =>
        p.id === product.id ? updatedProduct : p
      );

      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      setProduct(updatedProduct);

      alert("Product updated successfully.");
    } catch {
      alert("Changes could not be saved. Image storage may be full.");
    }
  }

  function toggleStatus() {
    if (!product) return;

    const updatedProduct = {
      ...product,
      carouselImages: images,
      status: product.status === "published" ? "draft" : "published",
    } as Product;

    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      const products: Product[] = saved ? JSON.parse(saved) : [];

      const updated = products.map((p) =>
        p.id === updatedProduct.id ? updatedProduct : p
      );

      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      setProduct(updatedProduct);

      alert("Product status updated.");
    } catch {
      alert("Product status could not be updated.");
    }
  }

  return (
    <main className="admin-page">
      <div className="admin-container">

        <Link href="/admin/products" className="admin-home-button">
          ← Back to Products
        </Link>

        {notFound ? (
          <div className="empty-products">Product not found.</div>
        ) : !product ? (
          <p>Loading...</p>
        ) : (
          <>
            <header className="admin-header">
              <h1>Edit Product</h1>
              <p>Manage product details and images.</p>
            </header>

            <section className="admin-section">
              <div className="product-card">

                <h3>Product Images</h3>

                <div className="edit-images">
                  {images.map((img, index) => {
                    const src = img.dataUrl || img.url;

                    return (
                      <div className="edit-image-item" key={index}>
                        {src && (
                          <img src={src} alt={`Product ${index + 1}`} />
                        )}

                        <button
                          type="button"
                          className="edit-image-remove"
                          onClick={() => removeImage(index)}
                          title="Remove image"
                        >
                          ×
                        </button>
                      </div>
                    );
                  })}
                </div>

                {images.length === 0 && (
                  <p>No product images. Upload an image below.</p>
                )}

                <label>Add / Change Images</label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImage}
                />

                <hr className="admin-divider" />

                <label>Title</label>
                <input
                  value={product.title || ""}
                  onChange={(e) => updateField("title", e.target.value)}
                />

                <label>Product Type</label>
                <input
                  value={product.productType || ""}
                  onChange={(e) => updateField("productType", e.target.value)}
                />

                <label>Category</label>
                <input
                  value={product.category || ""}
                  onChange={(e) => updateField("category", e.target.value)}
                />

                <label>Sub Category</label>
                <input
                  value={product.subCategory || ""}
                  onChange={(e) => updateField("subCategory", e.target.value)}
                />

                <label>Series Name</label>
                <input
                  value={product.seriesName || ""}
                  onChange={(e) => updateField("seriesName", e.target.value)}
                />

                <label>Description</label>
                <textarea
                  rows={6}
                  value={product.description || ""}
                  onChange={(e) => updateField("description", e.target.value)}
                />

                <div className="admin-actions">
                  <button
                    type="button"
                    className="publish-button"
                    onClick={saveChanges}
                  >
                    Save Changes
                  </button>

                  <button
                    type="button"
                    className="toggle-status-button"
                    onClick={toggleStatus}
                  >
                    {product.status === "published"
                      ? "Move to Draft"
                      : "Publish Product"}
                  </button>
                </div>

              </div>
            </section>
          </>
        )}
      </div>
    </main>
  );
}
