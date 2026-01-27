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
    searchParams?: SearchParams;
};

function yen(n: number) {
    return new Intl.NumberFormat("ja-JP").format(n);
}

function toArray(v?: string | string[]) {
    if (!v) return [];
    return Array.isArray(v) ? v : [v];
}

export default function ProtoV0C1ConfirmPage({ searchParams }: Props) {
    const sp = searchParams ?? {};

    const variant = sp.variant === "dp" ? "dp" : "control";
    const productId = sp.productId ?? "";
    const productPrice = Number(sp.productPrice ?? 0) || 0;

    const shippingId = sp.shippingId ?? "normal";
    const options = toArray(sp.opt);

    // 仮定義（shippingと揃える）
    const shippingPrice = shippingId === "premium" ? 150 : 0;
    const optionsPrice =
        (options.includes("insurance") ? 300 : 0) +
        (options.includes("giftwrap") ? 200 : 0);

    const total = productPrice + shippingPrice + optionsPrice;

    return (
        <main className="space-y-6">
            <header>
                <div className="text-xs text-gray-500">proto / v0 / c1</div>
                <h1 className="text-xl font-bold">
                    カテゴリー1 / 最終確認（{variant}）
                </h1>
            </header>

            <section className="rounded-lg border p-4 space-y-2 text-sm">
                <div>
                    商品: <span className="font-mono">{productId}</span>
                </div>
                <div>商品価格: {yen(productPrice)}円</div>
            </section>

            <section className="rounded-lg border p-4 space-y-2 text-sm">
                <div>配送方法: {shippingId}</div>
                <div>配送料: +{yen(shippingPrice)}円</div>
            </section>

            <section className="rounded-lg border p-4 space-y-2 text-sm">
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

            <section className="rounded-lg border p-4 text-base font-semibold">
                合計金額: {yen(total)}円
            </section>

            <div className="space-y-2 text-sm">
                <button
                    disabled
                    className="block w-full rounded-lg border p-3 text-center text-gray-500"
                >
                    注文を確定する（ダミー）
                </button>
            </div>
            <Link
                href={`/proto/v0/c1/shipping?variant=${variant}&productId=${productId}&productPrice=${productPrice}`}
                className="hover:underline block"
            >
                ← 配送選択へ戻る
            </Link>
        </main>
    );
}
