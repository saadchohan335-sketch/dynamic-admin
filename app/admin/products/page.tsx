
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Product, STORAGE_KEY } from "../lib/products";

const PER_PAGE = 7;

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [toDelete, setToDelete] = useState<Product | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      const data: unknown = saved ? JSON.parse(saved) : [];
      if (Array.isArray(data)) setProducts(data);
    } catch {
      setProducts([]);
    }
  }, []);

  function save(updated: Product[]) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      setProducts(updated);
      setSelectedIds([]);
    } catch {
      alert("Changes could not be saved.");
    }
  }

  function confirmDelete() {
    if (!toDelete) return;
    save(products.filter((p) => p.id !== toDelete.id));
    setToDelete(null);
  }

  function getPrice(p: Product) {
    const item = p as unknown as { price?: number | null };
    return typeof item.price === "number" ? item.price : null;
  }

  function getDiscountPrice(p: Product) {
    return typeof p.discountPrice === "number"
      ? p.discountPrice
      : null;
  }

  function getImage(p: Product) {
    const item = p as unknown as {
      carouselImages?: { dataUrl?: string; url?: string }[];
    };
    const first = item.carouselImages?.[0];
    return first?.dataUrl || first?.url || "";
  }

  const types = Array.from(
    new Set(products.map((p) => p.productType))
  ).filter(Boolean);

  const categories = Array.from(
    new Set(products.map((p) => p.category))
  ).filter(Boolean);

  const filtered = products.filter((p) => {
    const q = search.trim().toLowerCase();
    const text =
      `${p.title} ${p.productType} ${p.category} ${p.subCategory}`.toLowerCase();

    return (
      (!q || text.includes(q)) &&
      (!typeFilter || p.productType === typeFilter) &&
      (!categoryFilter || p.category === categoryFilter) &&
      (!statusFilter || p.status === statusFilter)
    );
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const current = Math.min(page, totalPages);
  const visible = filtered.slice(
    (current - 1) * PER_PAGE,
    current * PER_PAGE
  );

  const allVisibleSelected =
    visible.length > 0 &&
    visible.every((p) => selectedIds.includes(p.id));

  function toggleProduct(id: string) {
    setSelectedIds((prev) =>
      prev.includes(id)
        ? prev.filter((selectedId) => selectedId !== id)
        : [...prev, id]
    );
  }

  function toggleAllVisible() {
    if (allVisibleSelected) {
      setSelectedIds((prev) =>
        prev.filter((id) => !visible.some((p) => p.id === id))
      );
    } else {
      setSelectedIds((prev) => [
        ...prev,
        ...visible
          .filter((p) => !prev.includes(p.id))
          .map((p) => p.id),
      ]);
    }
  }

  return (
    <main className="admin-page">
      <div className="admin-container">
        <header className="pl-header">
          <h1 className="pl-heading">Products List</h1>

          <Link
            href="/admin/add-product?new=true"
            className="publish-button"
          >
            + Add Product
          </Link>
        </header>

        <section className="pl-box">
          <div className="pl-filters">
            <input
              className="pl-search"
              placeholder="Search Products by Name, Type, Category and Sub-category"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
                setSelectedIds([]);
              }}
            />

            {/* Product Type Filter */}
            <div className="pl-filter-group">
              <div className="pl-filter-item">
                <select
                  value={typeFilter}
                  onChange={(e) => {
                    setTypeFilter(e.target.value);
                    setPage(1);
                    setSelectedIds([]);
                  }}
                >
                  <option value="" hidden>
                    Product Type
                  </option>

                  {types.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>

                {typeFilter && (
                  <button
                    type="button"
                    onClick={() => {
                      setTypeFilter("");
                      setPage(1);
                      setSelectedIds([]);
                    }}
                    aria-label="Clear product type"
                  >
                    ×
                  </button>
                )}
              </div>
            </div>

            {/* Category Filter */}
            <div className="pl-filter-group">
              <div className="pl-filter-item">
                <select
                  value={categoryFilter}
                  onChange={(e) => {
                    setCategoryFilter(e.target.value);
                    setPage(1);
                    setSelectedIds([]);
                  }}
                >
                  <option value="" hidden>
                    Category
                  </option>

                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>

                {categoryFilter && (
                  <button
                    type="button"
                    onClick={() => {
                      setCategoryFilter("");
                      setPage(1);
                      setSelectedIds([]);
                    }}
                    aria-label="Clear category"
                  >
                    ×
                  </button>
                )}
              </div>
            </div>

            {/* Status Filter */}
            <div className="pl-filter-group">
              <div className="pl-filter-item">
                <select
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value);
                    setPage(1);
                    setSelectedIds([]);
                  }}
                >
                  <option value="" hidden>
                    Status
                  </option>

                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                </select>

                {statusFilter && (
                  <button
                    type="button"
                    onClick={() => {
                      setStatusFilter("");
                      setPage(1);
                      setSelectedIds([]);
                    }}
                    aria-label="Clear status"
                  >
                    ×
                  </button>
                )}
              </div>
            </div>
          </div>

          {visible.length === 0 ? (
            <div className="empty-products">No products found.</div>
          ) : (
            <div className="pl-scroll">
              <table className="pl-table">
                <thead>
                  <tr>
                    <th className="pl-check">
                      <input
                        type="checkbox"
                        checked={allVisibleSelected}
                        onChange={toggleAllVisible}
                        aria-label="Select all products on this page"
                      />
                    </th>
                    <th>Name</th>
                    <th>Product Type</th>
                    <th>Categories</th>
                    <th>Sub-Category</th>
                    <th>Price</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {visible.map((p) => {
                    const img = getImage(p);
                    const price = getPrice(p);
                    const discountPrice = getDiscountPrice(p);

                    return (
                      <tr key={p.id}>
                        <td className="pl-check">
                          <input
                            type="checkbox"
                            checked={selectedIds.includes(p.id)}
                            onChange={() => toggleProduct(p.id)}
                            aria-label={`Select ${p.title}`}
                          />
                        </td>

                        <td>
                          <div className="pl-name">
                            {img ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={img}
                                alt=""
                                className="pl-img"
                              />
                            ) : (
                              <div className="pl-img pl-img-empty" />
                            )}

                            <span className="pl-title">{p.title}</span>
                          </div>
                        </td>

                        <td>{p.productType || "-"}</td>
                        <td>{p.category || "-"}</td>
                        <td>{p.subCategory || "-"}</td>

                        <td>
                          {price !== null ? (
                            discountPrice !== null &&
                            discountPrice < price ? (
                              <div
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  gap: "3px",
                                }}
                              >
                                <span
                                  style={{
                                    textDecoration: "line-through",
                                    color: "#9ca3af",
                                    fontSize: "13px",
                                  }}
                                >
                                  {price}
                                </span>

                                <span
                                  style={{
                                    color: "#7c22ff",
                                    fontWeight: 600,
                                  }}
                                >
                                  {discountPrice}
                                </span>
                              </div>
                            ) : (
                              price
                            )
                          ) : (
                            "-"
                          )}
                        </td>

                        <td>
                          <span
                            className={`pl-status ${
                              p.status === "published"
                                ? "pl-status-pub"
                                : "pl-status-draft"
                            }`}
                          >
                            <span className="pl-dot" />
                            {p.status === "published"
                              ? "Published"
                              : "Draft"}
                          </span>
                        </td>

                        <td>
                          <div className="pl-actions">
                            <Link
                              href={`/admin/add-product?edit=${p.id}`}
                              title="Edit"
                              className="pl-icon"
                            >
                              <svg
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <path d="M12 20h9" />
                                <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
                              </svg>
                            </Link>

                            <button
                              type="button"
                              title="Delete"
                              className="pl-icon pl-icon-delete"
                              onClick={() => setToDelete(p)}
                            >
                              <svg
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <path d="M3 6h18" />
                                <path d="M8 6V4h8v2" />
                                <path d="M19 6l-1 14H6L5 6" />
                                <path d="M10 11v6M14 11v6" />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          <div className="pl-pager">
            <button
              type="button"
              className="pl-page"
              disabled={current === 1}
              onClick={() => {
                setPage(current - 1);
                setSelectedIds([]);
              }}
            >
              Back
            </button>

            {Array.from(
              { length: totalPages },
              (_, i) => i + 1
            ).map((n) => (
              <button
                key={n}
                type="button"
                className={`pl-page ${
                  n === current ? "pl-page-active" : ""
                }`}
                onClick={() => {
                  setPage(n);
                  setSelectedIds([]);
                }}
              >
                {String(n).padStart(2, "0")}
              </button>
            ))}

            <button
              type="button"
              className="pl-page"
              disabled={current === totalPages}
              onClick={() => {
                setPage(current + 1);
                setSelectedIds([]);
              }}
            >
              Next
            </button>
          </div>
        </section>
      </div>

      {toDelete && (
        <div className="pl-overlay">
          <div className="pl-modal">
            <h3>Delete Product?</h3>

            <p>
              Are you sure you want to delete{" "}
              <strong>{toDelete.title}</strong>?
            </p>

            <div className="pl-modal-actions">
              <button
                type="button"
                className="save-draft-button"
                onClick={() => setToDelete(null)}
              >
                Cancel
              </button>

              <button
                type="button"
                className="pl-delete-btn"
                onClick={confirmDelete}
              >
                Delete Product
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
