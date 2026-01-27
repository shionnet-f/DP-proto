// 商品ページ
import Link from "next/link";

type Props = {
    searchParams?: Promise<{ variant?: string }>;
};

const demoProducts = [
    { id: "p1", name: "prodact1" },
    { id: "p2", name: "prodact2" },
    { id: "p3", name: "prodact3" },
    { id: "p4", name: "prodact4" },
    { id: "p5", name: "prodact5" },
    { id: "p6", name: "prodact6" },
];

export default async function ProtoV0C1ProductsPage({ searchParams }: Props) {
    const sp = (await searchParams) ?? {};
    const variant = sp.variant === "dp" ? "dp" : "control";

    return (
        <div className="space-y-4">
            <h1 className="text-xl font-bold">カテゴリー1 / 商品選択（{variant}）</h1>

            <p className="text-sm text-gray-700">
                いまは選択→遷移だけ通す。ログは後で入れる。
            </p>

            <div className="grid grid-cols-3 gap-3">
                {demoProducts.map((p) => (
                    <div key={p.id} className="rounded-lg border p-3">
                        <div className="font-semibold">{p.name}</div>
                        <div className="mt-2">
                            <Link
                                href={`/proto/v0/c1/shipping?variant=${variant}&productId=${p.id}`}
                                className="inline-block rounded-md border px-3 py-2 text-sm hover:bg-gray-50"
                            >
                                この商品を選ぶ →
                            </Link>
                        </div>
                    </div>
                ))}
            </div>

            <div className="text-sm">
                <Link href="/proto/v0" className="hover:underline">
                    ← v0トップへ戻る
                </Link>
            </div>

        </div>
    );
}
