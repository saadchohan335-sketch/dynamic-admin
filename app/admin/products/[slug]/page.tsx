import { Suspense } from "react";
import ProductDetails from "./ProductDetails";

async function Details({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <ProductDetails slug={slug} />;
}

export default function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <Details params={params} />
    </Suspense>
  );
}