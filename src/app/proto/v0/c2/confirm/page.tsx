// src/app/proto/v0/c2/confirm/page.tsx
import Link from "next/link";
import ConfirmSummary from "./ConfirmSummary";

type SearchParams = {
  variant?: string;
  productId?: string;
  productPrice?: string;
  shippingId?: string; // c2は未選択あり
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

function shippingTitle(id?: string) {
  if (!id) return "未選択";
  return id === "express" ? "お急ぎ配送" : "通常配送";
}

export default async function ProtoV0C2ConfirmPage({ searchParams }: Props) {
  const sp = (await searchParams) ?? {};
  const variant = sp.variant === "dp" ? "dp" : "control";
  const isDP = variant === "dp";

  const productId = sp.productId ?? "";
  const productPrice = Number(sp.productPrice ?? 0) || 0;

  // c2: 未選択許容（shippingページで未選択のまま進める）
  const shippingId = sp.shippingId; // undefined のままありうる
  const options = toArray(sp.opt);

  // Shipping側と一致させる（未選択なら 0）
  const shippingPrice =
    shippingId === "express" ? 150 : shippingId === "normal" ? 0 : 0;

  const optionsPrice =
    (options.includes("insurance") ? 300 : 0) +
    (options.includes("giftwrap") ? 200 : 0);

  const total = productPrice + shippingPrice + optionsPrice;

  // 戻る用URL（shippingId/opt を保持）
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
        <div className="text-xs text-gray-500">proto / v0 / c2</div>
        <h1 className="text-xl font-bold">
          カテゴリー2 / 最終確認（{variant}）
        </h1>
        <p className="text-sm text-gray-600">
          注文内容を確認して、注文を確定してください。
        </p>
      </header>

      {/* 商品 */}
      <section className="rounded-lg border bg-white p-4 space-y-2 text-sm">
        <div>
          商品: <span className="font-mono">{productId}</span>
        </div>
        <div>商品価格: ¥{yen(productPrice)}</div>
      </section>

      {/* ★ c2: ここで「内訳の出し方」を分岐（control: そのまま / dp: 折りたたみ） */}
      <ConfirmSummary
        isDP={isDP}
        shippingId={shippingId}
        shippingTitle={shippingTitle(shippingId)}
        shippingPrice={shippingPrice}
        options={options}
        optionsPrice={optionsPrice}
        total={total}
      />

      {/* 確定ボタン（今回はdisabledでOK） */}
      <div className="space-y-2 text-sm">
        <button
          disabled
          className="block w-full rounded-lg border p-3 text-center bg-yellow-300"
        >
          注文を確定する
        </button>
      </div>

      <Link
        href={`/proto/v0/c2/shipping?${qp.toString()}`}
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
