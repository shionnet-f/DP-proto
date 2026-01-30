import Link from "next/link";

export default async function ProtoV0C2ProductsPage() {
  return (
    <>
      <h1>ProtoV0C2ProductsPage</h1>

      {/* ボタン */}
      <div className="mt-4 flex justify-end">
        <Link
          href={`/proto/v0/c2/shipping`}
          className="rounded-md border px-3 py-2 text-sm hover:bg-gray-50"
        >
          購入へ
        </Link>
      </div>
    </>
  );
}
