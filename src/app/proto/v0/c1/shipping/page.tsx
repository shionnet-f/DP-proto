// src/app/proto/v0/c1/shipping/page.tsx
import Link from "next/link";

type SearchParams = {
  variant?: string;
  productId?: string;
  productPrice?: string;
  shippingId?: string; // ✅ 未選択なら undefined のまま
  opt?: string | string[];
};

type Props = {
  searchParams?: Promise<SearchParams>;
};

const SHIPPING = [
  {
    id: "express",
    title: "お急ぎ配送",
    priceYen: 150,
    pros: ["到着目安：1〜2日", "急ぎの予定に間に合いやすい"],
    cons: ["追加料金がかかります"],
    featured: true,
  },
  {
    id: "normal",
    title: "通常配送",
    priceYen: 0,
    pros: ["追加料金なし"],
    cons: ["到着目安：3〜5日"],
    featured: false,
  },
] as const;

const OPTIONS = [
  {
    id: "insurance",
    label: "配送補償",
    priceYen: 300,
    desc: "破損・紛失に備えます",
  },
  {
    id: "giftwrap",
    label: "ギフト包装",
    priceYen: 200,
    desc: "包装を追加します",
  },
] as const;

function yen(n: number) {
  return new Intl.NumberFormat("ja-JP").format(n);
}

function toArray(v?: string | string[]) {
  if (!v) return [];
  return Array.isArray(v) ? v : [v];
}

export default async function ProtoV0C1ShippingPage({ searchParams }: Props) {
  const sp = (await searchParams) ?? {};
  const variant = sp.variant === "dp" ? "dp" : "control";
  const isDP = variant === "dp";

  const productId = sp.productId ?? "";
  const productPrice = Number(sp.productPrice ?? 0) || 0;

  // ✅ 初期値なし（未選択）
  const selectedShippingId = sp.shippingId; // ← default を置かない
  const selectedOpts = new Set(toArray(sp.opt));

  // ✅ 選択されていない可能性がある（null許容）
  const shipping = SHIPPING.find((s) => s.id === selectedShippingId) ?? null;

  const optionsTotal = OPTIONS.reduce(
    (acc, o) => acc + (selectedOpts.has(o.id) ? o.priceYen : 0),
    0,
  );

  // ✅ 未選択なら配送料は 0 として計算（※最終的にconfirm側でどう扱うかは仕様）
  const shippingPrice = shipping?.priceYen ?? 0;
  const total = productPrice + shippingPrice + optionsTotal;

  const baseParams: Record<string, string> = {
    variant,
    productId,
    productPrice: String(productPrice),
  };

  const makeShippingHref = (shippingId: string) => {
    const qp = new URLSearchParams(baseParams);
    qp.set("shippingId", shippingId);
    for (const o of selectedOpts) qp.append("opt", o);
    return `/proto/v0/c1/shipping?${qp.toString()}`;
  };

  const toggleOptHref = (optId: string) => {
    const next = new Set(selectedOpts);
    if (next.has(optId)) next.delete(optId);
    else next.add(optId);

    const qp = new URLSearchParams(baseParams);
    // ✅ 未選択なら shippingId を付けない（初期値無を維持）
    if (selectedShippingId) qp.set("shippingId", selectedShippingId);
    for (const o of next) qp.append("opt", o);
    return `/proto/v0/c1/shipping?${qp.toString()}`;
  };

  const confirmHref = () => {
    const qp = new URLSearchParams(baseParams);
    // ✅ 未選択なら shippingId を付けない（confirmでどう扱うかが「省略DP」のコア）
    if (selectedShippingId) qp.set("shippingId", selectedShippingId);
    for (const o of selectedOpts) qp.append("opt", o);
    return `/proto/v0/c1/confirm?${qp.toString()}`;
  };

  return (
    <main className="mx-auto max-w-6xl px-6 space-y-6">
      <header className="space-y-1">
        <h1 className="text-xl font-bold">
          カテゴリー1 / 配送・オプション（{variant}）
        </h1>
        <p className="text-sm text-gray-600">
          配送方法とオプションを選択してください。
        </p>
      </header>

      {/* 選択商品 */}
      <section className="rounded-lg border bg-white p-4">
        <div className="flex gap-4">
          <div className="h-20 w-20 shrink-0 rounded-md bg-gray-200" />
          <div className="space-y-1 text-sm">
            <div className="font-semibold">選択中の商品</div>
            <div className="font-mono text-xs text-gray-600">{productId}</div>
            <div>価格：¥{yen(productPrice)}</div>
          </div>
        </div>
      </section>

      {/* 1行2列 */}
      <section className="grid gap-4 md:grid-cols-2">
        {/* 配送方法 */}
        <div className="rounded-lg border bg-white p-4 space-y-3">
          <h2 className="font-semibold">配送方法</h2>

          {/* 未選択のヒント（小さめ） */}
          {!selectedShippingId && (
            <p className="text-xs text-gray-500">
              ※配送方法を選択できます（未選択のまま進めることも可能です）
            </p>
          )}

          <div className="space-y-2">
            {SHIPPING.map((s) => {
              const checked = selectedShippingId === s.id;

              // 「おすすめ」バッジ：dp時だけ出す（expressのみ）
              const isFeatured = isDP && !!s.featured;

              // dp時は express を常に薄く強調（選択してなくても）
              const emphasizeExpress = isDP && s.id === "express";

              return (
                <Link
                  key={s.id}
                  href={makeShippingHref(s.id)}
                  className={[
                    "block rounded-lg border p-3 hover:bg-gray-50 transition",
                    checked ? "border-2 shadow-sm" : "",
                    emphasizeExpress
                      ? "bg-orange-50 border-orange-200 border-l-4 border-l-orange-400"
                      : "bg-white",
                  ].join(" ")}
                >
                  <div className="flex items-start gap-3">
                    {/* ✅ ラジオ風（初期値なしなら黒丸は出ない） */}
                    <div
                      className={[
                        "mt-1 h-4 w-4 rounded-full border flex items-center justify-center",
                        checked ? "border-gray-700" : "border-gray-400",
                      ].join(" ")}
                    >
                      {checked ? (
                        <div className="h-2 w-2 rounded-full bg-gray-700" />
                      ) : null}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <div className="font-semibold">
                          {s.title}
                          {isFeatured && (
                            <span className="ml-2 rounded-full bg-orange-100 text-orange-700 px-2 py-0.5 text-xs font-medium">
                              おすすめ
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-gray-700">
                          +¥{yen(s.priceYen)}
                        </div>
                      </div>

                      <div className="mt-2 grid gap-1 text-sm">
                        <div className="text-gray-700">
                          <span className="font-medium">メリット：</span>
                          {s.pros.join(" / ")}
                        </div>
                        <div className="text-gray-500">
                          <span className="font-medium">注意：</span>
                          {s.cons.join(" / ")}
                        </div>
                      </div>

                      {isFeatured && (
                        <p className="mt-2 text-sm text-gray-700">
                          迷った場合はこちらを選ぶ方が安心です。
                        </p>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* オプション */}
        <div className="rounded-lg border bg-white p-4 space-y-3">
          <h2 className="font-semibold">オプション</h2>

          <div className="space-y-2">
            {OPTIONS.map((o) => {
              const checked = selectedOpts.has(o.id);

              return (
                <Link
                  key={o.id}
                  href={toggleOptHref(o.id)}
                  className={[
                    "block rounded-lg border p-3 hover:bg-gray-50 transition",
                    checked ? "border-2 shadow-sm" : "",
                  ].join(" ")}
                >
                  <div className="flex items-start gap-3">
                    {/* チェック風 */}
                    <div className="mt-1 h-4 w-4 rounded border flex items-center justify-center">
                      {checked ? <div className="h-2 w-2 bg-gray-700" /> : null}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <div className="font-semibold">{o.label}</div>
                        <div className="text-sm text-gray-700">
                          +¥{yen(o.priceYen)}
                        </div>
                      </div>
                      <div className="mt-1 text-sm text-gray-600">{o.desc}</div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* 合計 */}
      <section className="rounded-lg border bg-white p-4 space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">商品</span>
          <span>¥{yen(productPrice)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">
            配送料（{shipping?.title ?? "未選択"}）
          </span>
          <span>+¥{yen(shippingPrice)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">オプション</span>
          <span>+¥{yen(optionsTotal)}</span>
        </div>
        <div className="border-t pt-2 flex justify-between text-base font-semibold">
          <span>合計</span>
          <span>¥{yen(total)}</span>
        </div>
      </section>

      {/* ナビ */}
      <div className="flex items-center justify-between">
        <Link
          href={`/proto/v0/c1/products?variant=${variant}`}
          className="text-sm hover:underline"
        >
          ← 商品選択へ戻る
        </Link>

        <Link
          href={confirmHref()}
          className="rounded-md border px-4 py-2 text-sm hover:bg-gray-50"
        >
          確認へ →
        </Link>
      </div>

      <Link href="/proto/v0" className="hover:underline text-sm block">
        ← v0トップへ戻る
      </Link>
    </main>
  );
}
