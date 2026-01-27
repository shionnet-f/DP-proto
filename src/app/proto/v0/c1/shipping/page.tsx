import Link from "next/link";

type SearchParams = {
    variant?: string;
    productId?: string;
    productPrice?: string; // queryは文字列で来るので string で受ける
    shippingId?: string;
    opt?: string | string[]; // opt=insurance&opt=giftwrap を想定
};

type Props = {
    searchParams?: SearchParams;
};

const SHIPPING = [
    { id: "normal", label: "通常配送", price: 0, desc: "到着目安：3〜5日" },
    { id: "premium", label: "安心配送", price: 150, desc: "到着目安：1〜2日・補償あり" },
] as const;

const OPTIONS = [
    { id: "giftwrap", label: "ギフト包装", price: 200, desc: "包装を追加します" },
    { id: "insurance", label: "配送補償", price: 300, desc: "破損・紛失に備えます" },
] as const;

function toArray(v?: string | string[]) {
    if (!v) return [];
    return Array.isArray(v) ? v : [v];
}

function yen(n: number) {
    return new Intl.NumberFormat("ja-JP").format(n);
}

export default function ProtoV0C1ShippingPage({ searchParams }: Props) {
    const sp = searchParams ?? {};

    const variant = sp.variant === "dp" ? "dp" : "control";
    const productId = sp.productId ?? "";
    const productPrice = Number(sp.productPrice ?? 0) || 0;

    const selectedShippingId = sp.shippingId ?? "normal";
    const selectedOpts = new Set(toArray(sp.opt));

    const shipping = SHIPPING.find((s) => s.id === selectedShippingId) ?? SHIPPING[0];
    const optionsTotal = OPTIONS.reduce((acc, o) => acc + (selectedOpts.has(o.id) ? o.price : 0), 0);
    const total = productPrice + shipping.price + optionsTotal;

    // confirmへ渡すクエリ（optは複数あるのでURLSearchParamsで構築）
    const confirmParams = new URLSearchParams();
    confirmParams.set("variant", variant);
    confirmParams.set("productId", productId);
    confirmParams.set("productPrice", String(productPrice));
    confirmParams.set("shippingId", shipping.id);
    for (const o of selectedOpts) confirmParams.append("opt", o);

    return (
        <main className="space-y-6">
            <header className="space-y-1">
                <div className="text-xs text-gray-500">proto / v0 / c1</div>
                <h1 className="text-xl font-bold">カテゴリー1 / 配送・オプション（{variant}）</h1>
            </header>

            <section className="rounded-lg border p-4 text-sm space-y-2">
                <div>
                    選択商品: <span className="font-mono">{productId}</span>
                </div>
                <div>
                    商品価格: <span className="font-mono">{yen(productPrice)}円</span>
                </div>
            </section>

            {/* 配送（ラジオ“風”：Linkで選ぶ） */}
            <section className="space-y-2">
                <h2 className="font-semibold">配送方法（選択）</h2>
                <div className="grid gap-2">
                    {SHIPPING.map((s) => {
                        const isSelected = s.id === shipping.id;

                        const qp = new URLSearchParams();
                        qp.set("variant", variant);
                        qp.set("productId", productId);
                        qp.set("productPrice", String(productPrice));
                        qp.set("shippingId", s.id);
                        for (const o of selectedOpts) qp.append("opt", o);

                        return (
                            <Link
                                key={s.id}
                                href={`/proto/v0/c1/shipping?${qp.toString()}`}
                                className={[
                                    "block rounded-lg border p-3 hover:bg-gray-50",
                                    isSelected ? "border-2 shadow-sm" : "",
                                ].join(" ")}
                            >
                                <div className="flex items-start gap-3">
                                    {/* ラジオ風の見た目（実体はLinkなのでinputは使わない） */}
                                    <div className="mt-1 h-4 w-4 rounded-full border flex items-center justify-center">
                                        {isSelected ? <div className="h-2 w-2 rounded-full border" /> : null}
                                    </div>

                                    <div className="flex-1">
                                        <div className="flex items-center justify-between gap-2">
                                            <div className="font-semibold">
                                                {s.label}（+{yen(s.price)}円）
                                            </div>
                                            {/* 分類1のDPはここで強調や文言を変える予定 */}
                                            {variant === "dp" && s.id === "premium" ? (
                                                <span className="rounded-full border px-2 py-0.5 text-xs">おすすめ</span>
                                            ) : null}
                                        </div>
                                        <div className="text-sm text-gray-700">{s.desc}</div>
                                        {variant === "dp" && s.id === "premium" ? (
                                            <div className="mt-1 text-sm text-gray-700">
                                                迷ったらこちらが安心です。大事な予定に間に合わせたい方に最適です。
                                            </div>
                                        ) : null}
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </section>

            {/* オプション（チェック“風”：LinkでON/OFF） */}
            <section className="space-y-2">
                <h2 className="font-semibold">オプション（任意）</h2>
                <div className="grid gap-2">
                    {OPTIONS.map((o) => {
                        const checked = selectedOpts.has(o.id);
                        const nextOpts = new Set(selectedOpts);
                        if (checked) nextOpts.delete(o.id);
                        else nextOpts.add(o.id);

                        const qp = new URLSearchParams();
                        qp.set("variant", variant);
                        qp.set("productId", productId);
                        qp.set("productPrice", String(productPrice));
                        qp.set("shippingId", shipping.id);
                        for (const x of nextOpts) qp.append("opt", x);

                        return (
                            <Link
                                key={o.id}
                                href={`/proto/v0/c1/shipping?${qp.toString()}`}
                                className={[
                                    "block rounded-lg border p-3 hover:bg-gray-50",
                                    checked ? "border-2 shadow-sm" : "",
                                ].join(" ")}
                            >
                                <div className="flex items-start gap-3">
                                    {/* チェック風 */}
                                    <div className="mt-1 h-4 w-4 rounded border flex items-center justify-center">
                                        {checked ? <div className="h-2 w-2 border" /> : null}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between gap-2">
                                            <div className="font-semibold">{o.label}</div>
                                            <div className="text-sm text-gray-700">+{yen(o.price)}円</div>
                                        </div>
                                        <div className="text-sm text-gray-700">{o.desc}</div>
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </section>

            {/* 合計（正直に表示） */}
            <section className="rounded-lg border p-4 text-sm space-y-2">
                <div className="flex justify-between">
                    <span className="text-gray-600">商品</span>
                    <span>{yen(productPrice)}円</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-600">配送料（{shipping.label}）</span>
                    <span>+{yen(shipping.price)}円</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-600">オプション</span>
                    <span>+{yen(optionsTotal)}円</span>
                </div>
                <div className="border-t pt-2 flex justify-between font-semibold">
                    <span>合計</span>
                    <span>{yen(total)}円</span>
                </div>
            </section>

            {/* 次へ */}
            <div className="text-sm space-y-2">
                <Link
                    href={`/proto/v0/c1/confirm?${confirmParams.toString()}`}
                    className="block rounded-lg border p-3 hover:bg-gray-50 text-center font-semibold"
                >
                    次へ（最終確認）
                </Link>

                <Link href={`/proto/v0/c1/products?variant=${variant}`} className="hover:underline block">
                    ← 商品選択へ戻る
                </Link>
                <Link href="/proto/v0" className="hover:underline block">
                    ← v0トップへ戻る
                </Link>
            </div>
        </main>
    );
}
