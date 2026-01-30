import Link from "next/link";

export default async function ProtoV0C2ShippingPage() {
  return (
    <>
      <h1>ProtoV0C2ShippingPage</h1>
      <Link
        href={`/proto/v0/c2/confirm`}
        className="rounded-md border px-4 py-2 text-sm hover:bg-gray-50"
      >
        確認へ →
      </Link>
    </>
  );
}
