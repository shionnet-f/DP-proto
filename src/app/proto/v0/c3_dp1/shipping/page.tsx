// src/app/proto/v0/c3/shipping/page.tsx
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

// 配送方法（お急ぎ便はここ）
const SHIPPING = [
  {
    id: "express",
    title: "お急ぎ配送",
    priceYen: 150,
    pros: ["到着目安：1〜2日"],
    cons: ["追加料金が発生します"],
  },
  {
    id: "normal",
    title: "通常配送",
    priceYen: 0,
    pros: ["到着目安：3〜5日"],
    cons: ["混雑状況により遅れる場合があります"],
  },
] as const;

// c3：保証 + メルマガ（DPでデフォルトONにする対象）
const OPTIONS = [
  {
    id: "warranty",
    label: "保証（30日）",
    priceYen: 300,
    desc: "初期不良・破損時のサポート",
  },
  {
    id: "newsletter",
    label: "お得な情報のメールを受け取る",
    priceYen: 0,
    desc: "クーポンやキャンペーン情報をお送りします（いつでも解除できます）",
  },
] as const;

function yen(n: number) {
  return new Intl.NumberFormat("ja-JP").format(n);
}

function toArray(v?: string | string[]) {
  if (!v) return [];
  return Array.isArray(v) ? v : [v];
}

export default async function ProtoV0C3ShippingPage({ searchParams }: Props) {
  const sp = (await searchParams) ?? {};
  const variant = sp.variant === "dp" ? "dp" : "control";
  const isDP = variant === "dp";

  const productId = sp.productId ?? "";
  const productPrice = Number(sp.productPrice ?? 0) || 0;

  // URLの opt を Set 化
  const selectedOpts = new Set(toArray(sp.opt));

  // --- DPデフォルト（押しつけ） ---
  // dpの場合：
  // 1) 配送をお急ぎ便にデフォルト
  const selectedShippingId = sp.shippingId ?? (isDP ? "express" : undefined);

  // 2) お急ぎ便/保証/メルマガをデフォルトON（=URLに無くてもON扱い）
  if (isDP) {
    selectedOpts.add("warranty");
    selectedOpts.add("newsletter");
  }
  // --- /DPデフォルト ---

  const shipping = SHIPPING.find((s) => s.id === selectedShippingId) ?? null;

  const optionsTotal = OPTIONS.reduce(
    (acc, o) => acc + (selectedOpts.has(o.id) ? o.priceYen : 0),
    0,
  );

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
    return `/proto/v0/c3/shipping?${qp.toString()}`;
  };

  const toggleOptHref = (optId: string) => {
    const next = new Set(selectedOpts);

    if (next.has(optId)) next.delete(optId);
    else next.add(optId);

    const qp = new URLSearchParams(baseParams);
    if (selectedShippingId) qp.set("shippingId", selectedShippingId);
    for (const o of next) qp.append("opt", o);
    return `/proto/v0/c3/shipping?${qp.toString()}`;
  };

  const confirmHref = () => {
    const qp = new URLSearchParams(baseParams);
    if (selectedShippingId) qp.set("shippingId", selectedShippingId);
    for (const o of selectedOpts) qp.append("opt", o);
    return `/proto/v0/c3_dp1/confirm?${qp.toString()}`;
  };

  return (
    <main className="mx-auto max-w-6xl px-6 space-y-6">
      <header className="space-y-1">
        <h1 className="text-xl font-bold">
          カテゴリー3 / 配送・オプション（{variant}）
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

          <div className="space-y-2">
            {SHIPPING.map((s) => {
              const checked = selectedShippingId === s.id;

              return (
                <Link
                  key={s.id}
                  href={makeShippingHref(s.id)}
                  className={[
                    "block rounded-lg border p-3 hover:bg-gray-50 transition bg-white",
                    checked ? "border-2 shadow-sm" : "",
                  ].join(" ")}
                >
                  <div className="flex items-start gap-3">
                    {/* ラジオ風 */}
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
                        <div className="font-semibold">{s.title}</div>
                        <div className="text-sm text-gray-700">
                          +¥{yen(s.priceYen)}
                        </div>
                      </div>

                      <div className="mt-2 grid gap-1 text-sm">
                        <div className="text-gray-700">
                          <span className="font-medium">内容：</span>
                          {s.pros.join(" / ")}
                        </div>
                        <div className="text-gray-500">
                          <span className="font-medium">注意：</span>
                          {s.cons.join(" / ")}
                        </div>
                      </div>
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
                    "block rounded-lg border p-3 hover:bg-gray-50 transition bg-white",
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

                      <div
                        className={[
                          "mt-1 text-gray-600",
                          isDP && o.id === "newsletter" ? "text-xs" : "text-sm",
                        ].join(" ")}
                      >
                        {o.desc}
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          <div className="pt-3 rounded-md bg-gray-50 p-3 text-sm flex items-center justify-between">
            <div className="text-gray-600">合計</div>
            <div className="font-semibold">¥{yen(total)}</div>
          </div>
        </div>
      </section>

      {/* ナビ */}
      <div className="flex items-center justify-between">
        <Link
          href={`/proto/v0/c3_dp1/products?variant=${variant}`}
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
