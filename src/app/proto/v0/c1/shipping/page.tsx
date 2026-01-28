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

const SHIPPING = [
    {
        id: "express",
        title: "お急ぎ配送",
        priceYen: 150,
        pros: [""],
        cons: ["到着目安：1〜2日"],
        featured: true,
    },
    {
        id: "normal",
        title: "通常配送",
        priceYen: 0,
        pros: ["到着目安：3〜5日"],
        cons: ["到着まで少し時間がかかる場合があります"],
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

    // ✅ 必ず正規化
    const variant = sp.variant === "dp" ? "dp" : "control";
    const isDP = variant === "dp";

    const productId = sp.productId ?? "";
    const productPrice = Number(sp.productPrice ?? 0) || 0;

    const selectedShippingId = sp.shippingId ?? "normal";
    const selectedOpts = new Set(toArray(sp.opt));

    const shipping =
        SHIPPING.find((s) => s.id === selectedShippingId) ?? SHIPPING[0];

    const optionsTotal = OPTIONS.reduce(
        (acc, o) => acc + (selectedOpts.has(o.id) ? o.priceYen : 0),
        0
    );

    const total = productPrice + shipping.priceYen + optionsTotal;

    const baseParams = {
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
        qp.set("shippingId", shipping.id);
        for (const o of next) qp.append("opt", o);
        return `/proto/v0/c1/shipping?${qp.toString()}`;
    };

    const confirmHref = () => {
        const qp = new URLSearchParams(baseParams);
        qp.set("shippingId", shipping.id);
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

            <section className="grid gap-4 md:grid-cols-2">
                <div className="rounded-lg border bg-white p-4 space-y-3">
                    <h2 className="font-semibold">配送方法</h2>

                    <div className="space-y-2">
                        {SHIPPING.map((s) => {
                            const checked = s.id === shipping.id;
                            const isFeatured = isDP && !!s.featured;
                            const emphasizeExpress = isDP && s.id === "express";

                            return (
                                <Link
                                    key={s.id}
                                    href={makeShippingHref(s.id)}
                                    className={[
                                        "block rounded-lg border p-3 hover:bg-gray-50 transition",
                                        checked ? "border-2 shadow-sm" : "",
                                        emphasizeExpress
                                            ? "border-2 border-orange-300 bg-orange-50"
                                            : "bg-white",
                                    ].join(" ")}
                                >
                                    <div className="flex items-start gap-3">
                                        <div className="mt-1 h-4 w-4 rounded-full border flex items-center justify-center">
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
                                                <div className="text-gray-700">{s.pros.join(" / ")}</div>
                                                <div className="text-gray-500">{s.cons.join(" / ")}</div>
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
                                        "block rounded-lg border p-3 hover:bg-gray-50",
                                        checked ? "border-2 shadow-sm" : "",
                                    ].join(" ")}
                                >
                                    <div className="flex items-start gap-3">
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

            <section className="rounded-lg border bg-white p-4 space-y-2 text-sm">
                <div className="flex justify-between">
                    <span className="text-gray-600">商品</span>
                    <span>¥{yen(productPrice)}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-600">配送料（{shipping.title}）</span>
                    <span>+¥{yen(shipping.priceYen)}</span>
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
