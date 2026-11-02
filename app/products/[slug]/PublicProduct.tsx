"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type ProductImage = { name?: string; dataUrl?: string; url?: string };

type Product = {
  id: string;
  productType: string;
  category: string;
  subCategory: string;
  title: string;
  slug: string;
  seriesName: string;
  description: string;
  status: "draft" | "published";
  ctaHeading?: string;
  ctaDescription?: string;
  price?: number | null;
  accordions?: { title: string; content: string }[];
  carouselImages?: ProductImage[];
};

function formatPrice(value: number) {
  return `$${value.toLocaleString("en-US")}`;
}

export default function PublicProduct({ slug }: { slug: string }) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [imgIndex, setImgIndex] = useState(0);
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("products");
      const list: Product[] = saved ? JSON.parse(saved) : [];
      const found = list.find(
        (p) => p.slug === decodeURIComponent(slug) && p.status === "published"
      );
      setProduct(found ?? null);
    } catch {
      setProduct(null);
    } finally {
      setLoaded(true);
    }
  }, [slug]);

  const images = (product?.carouselImages ?? [])
    .map((i) => i.dataUrl || i.url || "")
    .filter(Boolean);
  const hasPrice = typeof product?.price === "number";

  return (
    <main className="min-h-screen bg-violet-50 text-gray-900">
      <header className="flex items-center justify-between border-b border-violet-100 bg-white px-8 py-4 shadow-sm">
        <Link href="/" className="text-xl font-bold text-indigo-950">
          Dynamic Store
        </Link>
        <Link
          href="/"
          className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-700"
        >
          ← All Products
        </Link>
      </header>

      <section className="mx-auto max-w-6xl px-6 py-8">
        {!loaded ? (
          <p className="text-center text-gray-600">Loading...</p>
        ) : !product ? (
          <div className="rounded-2xl border border-violet-200 bg-white p-10 text-center">
            <h2 className="text-xl font-bold text-violet-700">
              Product not found
            </h2>
            <p className="mt-2 text-gray-600">
              This product does not exist or is not published.
            </p>
          </div>
        ) : (
          <>
            <nav className="mb-5 text-sm text-gray-500">
              <Link href="/" className="hover:text-violet-700">
                Home
              </Link>
              <span className="mx-2">/</span>
              <span>{product.productType}</span>
              <span className="mx-2">/</span>
              <span className="text-indigo-950">{product.title}</span>
            </nav>

            <div className="grid gap-6 rounded-2xl border border-violet-100 bg-white p-6 shadow-sm md:grid-cols-5">
              <div className="md:col-span-2">
                {images.length > 0 ? (
                  <>
                    <div className="relative">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={images[imgIndex]}
                        alt={product.title}
                        className="h-64 w-full rounded-xl border border-violet-100 bg-white object-contain p-2"
                      />
                      {images.length > 1 && (
                        <>
                          <button
                            type="button"
                            aria-label="Previous image"
                            onClick={() =>
                              setImgIndex(
                                (imgIndex - 1 + images.length) % images.length
                              )
                            }
                            className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/90 px-3 py-1 text-violet-700 shadow hover:bg-white"
                          >
                            ‹
                          </button>
                          <button
                            type="button"
                            aria-label="Next image"
                            onClick={() =>
                              setImgIndex((imgIndex + 1) % images.length)
                            }
                            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/90 px-3 py-1 text-violet-700 shadow hover:bg-white"
                          >
                            ›
                          </button>
                        </>
                      )}
                    </div>

                    {images.length > 1 && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {images.map((src, i) => (
                          <button
                            key={i}
                            type="button"
                            onClick={() => setImgIndex(i)}
                            className={`overflow-hidden rounded-lg border-2 ${
                              i === imgIndex
                                ? "border-violet-600"
                                : "border-violet-100"
                            }`}
                          >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={src}
                              alt=""
                              className="h-14 w-14 bg-white object-cover"
                            />
                          </button>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <div className="flex h-64 items-center justify-center rounded-xl border border-violet-100 bg-violet-50 text-gray-400">
                    No image
                  </div>
                )}
              </div>

              <div className="md:col-span-3">
                <span className="inline-block rounded-full bg-violet-100 px-3 py-1 text-xs font-semibold text-violet-700">
                  {product.productType}
                </span>

                <h1 className="mt-3 break-words text-2xl font-bold text-indigo-950 md:text-3xl">
                  {product.title}
                </h1>

                <div className="mt-3 flex flex-wrap gap-2 text-xs">
                  <span className="rounded-md border border-violet-100 bg-violet-50 px-2 py-1 text-gray-600">
                    Category: {product.category}
                  </span>
                  <span className="rounded-md border border-violet-100 bg-violet-50 px-2 py-1 text-gray-600">
                    Sub-Category: {product.subCategory}
                  </span>
                  <span className="rounded-md border border-violet-100 bg-violet-50 px-2 py-1 text-gray-600">
                    Series: {product.seriesName}
                  </span>
                </div>

                {hasPrice && (
                  <div className="mt-5">
                    <span className="text-3xl font-bold text-indigo-950">
                      {formatPrice(product.price as number)}
                    </span>
                  </div>
                )}

                <div className="mt-6 border-t border-violet-100 pt-5">
                  <h2 className="text-sm font-semibold uppercase tracking-wide text-violet-700">
                    Description
                  </h2>
                  <p className="mt-2 whitespace-pre-wrap break-words leading-relaxed text-gray-700">
                    {product.description}
                  </p>
                </div>
              </div>
            </div>

            {(product.accordions ?? []).length > 0 && (
              <div className="mt-6 space-y-3">
                <h2 className="text-lg font-bold text-indigo-950">
                  More Information
                </h2>
                {(product.accordions ?? []).map((item, i) => (
                  <div
                    key={i}
                    className="overflow-hidden rounded-xl border border-violet-100 bg-white shadow-sm"
                  >
                    <button
                      type="button"
                      onClick={() => setOpenIndex(openIndex === i ? null : i)}
                      className="flex w-full items-center justify-between px-5 py-4 text-left font-semibold text-indigo-950 hover:bg-violet-50"
                    >
                      {item.title}
                      <span className="text-xl text-violet-600">
                        {openIndex === i ? "−" : "+"}
                      </span>
                    </button>
                    {openIndex === i && (
                      <p className="whitespace-pre-wrap break-words border-t border-violet-100 px-5 py-4 text-gray-600">
                        {item.content}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}

            {(product.ctaHeading || product.ctaDescription) && (
              <div className="mt-8 rounded-2xl bg-violet-600 p-8 text-center text-white">
                {product.ctaHeading && (
                  <h2 className="text-2xl font-bold">{product.ctaHeading}</h2>
                )}
                {product.ctaDescription && (
                  <p className="mx-auto mt-2 max-w-xl text-violet-100">
                    {product.ctaDescription}
                  </p>
                )}
                <button
                  type="button"
                  className="mt-5 rounded-lg bg-white px-6 py-3 font-semibold text-violet-700 hover:bg-violet-50"
                >
                  Book a Demo
                </button>
              </div>
            )}
          </>
        )}
      </section>
    </main>
  );
}