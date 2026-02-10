// src/app/proto/v0/c1_dp2/confirm/page.tsx
import Link from "next/link";

type SearchParams = {
  variant?: string;
  productId?: string;
  productPrice?: string;
  shippingId?: string; // 未選択なら undefined
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

function shippingPriceOf(shippingId?: string) {
  if (shippingId === "express") return 150;
  if (shippingId === "normal") return 0;
  return 0; // 未選択は 0 として扱う（表示は未選択）
}

function shippingLabelOf(shippingId?: string) {
  if (shippingId === "express") return "お急ぎ配送";
  if (shippingId === "normal") return "通常配送";
  return "未選択";
}

export default async function ProtoV0C1Dp2ConfirmPage({ searchParams }: Props) {
  const sp = (await searchParams) ?? {};
  const variant = sp.variant === "dp" ? "dp" : "control";

  const productId = sp.productId ?? "";
  const productPrice = Number(sp.productPrice ?? 0) || 0;

  const shippingId = sp.shippingId; // ✅ デフォルトを置かない（未選択のまま）
  const options = toArray(sp.opt);

  const shippingPrice = shippingPriceOf(shippingId);

  const optionsPrice =
    (options.includes("insurance") ? 300 : 0) +
    (options.includes("giftwrap") ? 200 : 0);

  const total = productPrice + shippingPrice + optionsPrice;

  // 戻る用URL（shippingId/optを保持）
  const qp = new URLSearchParams({
    variant,
    productId,
    productPrice: String(productPrice),
  });
  if (shippingId) qp.set("shippingId", shippingId);
  for (const o of options) qp.append("opt", o);

  return (
    <main className="mx-auto max-w-6xl px-6 space-y-6">
      <header className="space-y-1">
        <div className="text-xs text-gray-500">proto / v0 / c1_dp2</div>
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
        <div>配送方法: {shippingLabelOf(shippingId)}</div>
        <div>
          配送料: +¥{yen(shippingPrice)}
          {shippingId ? null : (
            <span className="ml-2 text-xs text-gray-500">（未選択）</span>
          )}
        </div>
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
        {/* 実験用：確定は無効のまま（必要ならcompleteへ遷移に変更可） */}
        <button
          disabled
          className="block w-full rounded-lg border p-3 text-center bg-yellow-100"
        >
          注文を確定する
        </button>
      </div>

      <Link
        href={`/proto/v0/c1_dp2/shipping?${qp.toString()}`}
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
