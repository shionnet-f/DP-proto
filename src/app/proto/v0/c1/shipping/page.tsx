// 配送ページ（枠だけ・遷移を通す）
import Link from "next/link";

type Props = {
    searchParams?: Promise<{ variant?: string; productId?: string }>;
};

export default async function ProtoV0C1ShippingPage({ searchParams }: Props) {
    const sp = (await searchParams) ?? {};
    const variant = sp.variant === "dp" ? "dp" : "control";
    const productId = sp.productId ?? "p2";

    return (
        <div className="space-y-4">
            <h1 className="text-xl font-bold">カテゴリー1 / 配送選択（{variant}）</h1>

            <div className="rounded-lg border p-4 text-sm">
                <div>
                    選択商品: <span className="font-mono">{productId}</span>
                </div>
            </div>

            <div className="space-y-2">
                <Link
                    href={`/proto/v0/c1/confirm?variant=${variant}&productId=${productId}&shippingId=normal`}
                    className="block rounded-lg border p-3 hover:bg-gray-50"
                >
                    <div className="font-semibold">通常配送（+0円）</div>
                    <div className="text-sm text-gray-700">到着目安：3〜5日</div>
                </Link>

                <Link
                    href={`/proto/v0/c1/confirm?variant=${variant}&productId=${productId}&shippingId=premium`}
                    className="block rounded-lg border p-3 hover:bg-gray-50"
                >
                    <div className="font-semibold">安心配送（+150円）</div>
                    <div className="text-sm text-gray-700">到着目安：1〜2日・補償あり</div>
                </Link>
            </div>

            <div className="text-sm">
                <Link
                    href={`/proto/v0/c1/products?variant=${variant}`}
                    className="hover:underline"
                >
                    ← 商品選択へ戻る
                </Link>
            </div>
            <div className="text-sm">
                <Link href="/proto/v0" className="hover:underline">
                    ← v0トップへ戻る
                </Link>
            </div>
        </div>
    );
}
