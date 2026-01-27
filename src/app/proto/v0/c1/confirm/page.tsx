// 確認ページ（枠だけ・遷移を通す）
"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function ProtoV0C1ConfirmPage() {
    const sp = useSearchParams();
    const variant = sp.get("variant") === "dp" ? "dp" : "control";
    const productId = sp.get("productId") ?? "p2";
    const shippingId = sp.get("shippingId") ?? "normal";

    return (
        <div className="space-y-4">
            <h1 className="text-xl font-bold">カテゴリー1 / 最終確認（{variant}）</h1>

            <div className="rounded-lg border p-4 text-sm space-y-1">
                <div>
                    productId: <span className="font-mono">{productId}</span>
                </div>
                <div>
                    shippingId: <span className="font-mono">{shippingId}</span>
                </div>
            </div>

            <button
                type="button"
                className="rounded-md border px-3 py-2 text-sm hover:bg-gray-50"
                onClick={() => {
                    console.log("submit_order", { variant, productId, shippingId });
                    alert("submit_order を console.log しました（60点版）");
                }}
            >
                注文を確定する（仮）
            </button>

            <div className="text-sm space-y-1">
                <Link
                    href={`/proto/v0/c1/shipping?variant=${variant}&productId=${productId}`}
                    className="hover:underline"
                >
                    ← 配送選択へ戻る
                </Link>
                <br />
                <Link href="/proto/v0" className="hover:underline">
                    ← v0トップへ戻る
                </Link>
            </div>
        </div>
    );
}
