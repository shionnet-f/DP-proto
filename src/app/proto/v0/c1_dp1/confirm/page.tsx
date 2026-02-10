// src/app/proto/v0/c1/confirm/page.tsx
import Link from "next/link";

type SearchParams = {
  variant?: string;
  productId?: string;
  productPrice?: string;
  shippingId?: string;
  opt?: string | string[];
};

type Props = {
  searchParams?: Promise<SearchParams>;
};

function yen(n: number) {
  return new Intl.NumberFormat("ja-JP").format(n);
}

function toArray(v?: string | string[]) {
  if (!v) return [];
  return Array.isArray(v) ? v : [v];
}

export default async function ProtoV0C1ConfirmPage({ searchParams }: Props) {
  const sp = (await searchParams) ?? {};
  const variant = sp.variant === "dp" ? "dp" : "control";

  const productId = sp.productId ?? "";
  const productPrice = Number(sp.productPrice ?? 0) || 0;

  const shippingId = sp.shippingId ?? "normal";
  const options = toArray(sp.opt);

  // Shipping側（express/normal）と一致させる
  const shippingPrice = shippingId === "express" ? 150 : 0;

  const optionsPrice =
    (options.includes("insurance") ? 300 : 0) +
    (options.includes("giftwrap") ? 200 : 0);

  const total = productPrice + shippingPrice + optionsPrice;

  // 戻る用URL（shippingId/optを保持）
  const qp = new URLSearchParams({
    variant,
    productId,
    productPrice: String(productPrice),
    shippingId,
  });
  for (const o of options) qp.append("opt", o);

  return (
    <main className="mx-auto max-w-6xl px-6 space-y-6">
      <header className="space-y-1">
        <div className="text-xs text-gray-500">proto / v0 / c1</div>
        <h1 className="text-xl font-bold">
          カテゴリー1 / 最終確認（{variant}）
        </h1>
      </header>

      <section className="rounded-lg border bg-white p-4 space-y-2 text-sm">
        <div>
          商品: <span className="font-mono">{productId}</span>
        </div>
        <div>商品価格: ¥{yen(productPrice)}</div>
      </section>

      <section className="rounded-lg border bg-white p-4 space-y-2 text-sm">
        <div>配送方法: {shippingId}</div>
        <div>配送料: +¥{yen(shippingPrice)}</div>
      </section>

      <section className="rounded-lg border bg-white p-4 space-y-2 text-sm">
        <div>オプション:</div>
        {options.length === 0 ? (
          <div className="text-gray-600">なし</div>
        ) : (
          <ul className="list-disc pl-5">
            {options.map((o) => (
              <li key={o}>{o}</li>
            ))}
          </ul>
        )}
      </section>

      <section className="rounded-lg border bg-white p-4 text-base font-semibold">
        合計金額: ¥{yen(total)}
      </section>

      <div className="space-y-2 text-sm">
        <button
          disabled
          className="block w-full rounded-lg border p-3 text-center bg-yellow-300"
        >
          注文を確定する
        </button>
      </div>

      <Link
        href={`/proto/v0/c1_dp1/shipping?${qp.toString()}`}
        className="hover:underline block text-sm"
      >
        ← 配送選択へ戻る
      </Link>
      <Link href="/proto/v0" className="hover:underline">
        ← v0トップへ戻る
      </Link>
    </main>
  );
}
