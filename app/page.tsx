"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type ProductStatus = "draft" | "published";

type ProductImage = {
  name?: string;
  dataUrl?: string;
  url?: string;
};

type Product = {
  id: string;
  productType: string;
  category: string;
  subCategory: string;
  title: string;
  slug: string;
  seriesName: string;
  description: string;
  status: ProductStatus;
  price?: number | null;
  discountPrice?: number | null;
  carouselImages?: ProductImage[];
};

function formatPrice(value: number) {
  return `$${value.toLocaleString("en-US")}`;
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [productsLoaded, setProductsLoaded] = useState(false);

  useEffect(() => {
    function loadProducts() {
      try {
        const savedProducts = localStorage.getItem("products");

        if (savedProducts) {
          const parsedProducts: unknown = JSON.parse(savedProducts);

          if (Array.isArray(parsedProducts)) {
            setProducts(parsedProducts as Product[]);
          } else {
            setProducts([]);
          }
        } else {
          setProducts([]);
        }
      } catch {
        setProducts([]);
      } finally {
        setProductsLoaded(true);
      }
    }

    loadProducts();

    window.addEventListener("focus", loadProducts);

    return () => {
      window.removeEventListener("focus", loadProducts);
    };
  }, []);

  const publishedProducts = products.filter(
    (product) => product.status === "published"
  );

  return (
    <main className="min-h-screen bg-violet-50 text-gray-900">
      <header className="flex items-center justify-between border-b border-violet-100 bg-white px-8 py-5 shadow-sm">
        <h1 className="text-2xl font-bold text-indigo-950">
          Dynamic Store
        </h1>

        <a
          href="/admin"
          className="rounded-lg bg-violet-600 px-5 py-3 text-white transition hover:bg-violet-700"
        >
          Admin Panel
        </a>
      </header>

      <section className="px-6 py-16 text-center">
        <h2 className="text-4xl font-bold text-indigo-950">
          Discover Our Products
        </h2>

        <p className="mt-4 text-gray-600">
          Explore our engineering and 3D technology solutions.
        </p>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-16">
        {!productsLoaded ? (
          <p className="rounded-xl border border-violet-100 bg-white p-8 text-center text-gray-600">
            Loading products...
          </p>
        ) : publishedProducts.length === 0 ? (
          <div className="rounded-2xl border border-violet-200 bg-violet-50 p-10 text-center">
            <h3 className="text-xl font-bold text-violet-700">
              No Products Available Yet
            </h3>

            <p className="mt-3 text-gray-600">
              Our products will appear here once they are published.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {publishedProducts.map((product) => {
              const firstImage = product.carouselImages?.[0];
              const imageSrc = firstImage?.dataUrl || firstImage?.url || "";
              const hasPrice = typeof product.price === "number";
              const hasDiscount =
                typeof product.discountPrice === "number";

              return (
                <Link
                  key={product.id}
                  href={`/products/${product.slug}`}
                  className="block"
                >
                  <article className="h-full rounded-xl border border-violet-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
                    {imageSrc && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={imageSrc}
                        alt={product.title}
                        className="mb-4 h-44 w-full rounded-lg border border-violet-100 bg-white object-contain"
                      />
                    )}

                    <p className="text-sm font-semibold text-violet-700">
                      {product.productType}
                    </p>

                    <h3 className="mt-2 break-words text-xl font-semibold text-indigo-950">
                      {product.title}
                    </h3>

                    <p className="mt-3 text-sm text-gray-500">
                      {product.category} · {product.subCategory}
                    </p>

                    <p className="mt-3 line-clamp-3 whitespace-pre-wrap break-words text-gray-600">
                      {product.description}
                    </p>

                    {(hasPrice || hasDiscount) && (
                      <p className="mt-4 text-lg font-bold text-indigo-950">
                        {hasDiscount ? (
                          <>
                            {formatPrice(product.discountPrice as number)}
                            {hasPrice && (
                              <span className="ml-2 text-sm font-normal text-gray-400 line-through">
                                {formatPrice(product.price as number)}
                              </span>
                            )}
                          </>
                        ) : (
                          formatPrice(product.price as number)
                        )}
                      </p>
                    )}

                    <p className="mt-4 text-sm font-medium text-violet-700">
                      Series: {product.seriesName}
                    </p>

                    <p className="mt-3 text-sm font-semibold text-violet-600">
                      View Details →
                    </p>
                  </article>
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}