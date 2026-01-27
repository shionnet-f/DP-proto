// 商品ページ
import Link from "next/link";

type Props = {
    searchParams?: Promise<{ variant?: string }>;
};

type Product = {
    id: string;
    name: string;
    capacityMah: number;
    weightG: number;
    priceYen: number;
    note: string;
    isTarget?: boolean;
    isConditionOk: boolean;
};

const CONDITION = {
    minMah: 10000,
    maxWeightG: 200,
    maxPriceYen: 3500,
} as const;


export const trial1Products: Product[] = [
    // --- OK（ターゲット：左上に来るよう先頭） ---
    {
        id: "p1",
        name: "モバイルバッテリー1",
        capacityMah: 10000,
        weightG: 189,
        priceYen: 3280,
        note: "バランス型。通学・外出向き。",
        isTarget: true,
        isConditionOk: true,
    },
    {
        id: "p2",
        name: "モバイルバッテリー2",
        capacityMah: 10000,
        weightG: 175,
        priceYen: 2980,
        note: "軽量寄りで持ち運び重視。",
        isConditionOk: true,
    },
    {
        id: "p3",
        name: "モバイルバッテリー3",
        capacityMah: 12000,
        weightG: 205, // ❌重さNG
        priceYen: 3390,
        note: "容量は良いが少し重い。",
        isConditionOk: false,
    },
    {
        id: "p4",
        name: "モバイルバッテリー4",
        capacityMah: 12000,
        weightG: 198,
        priceYen: 3390,
        note: "容量多めの定番。ギリギリ軽い。",
        isConditionOk: true,
    },
    {
        id: "p5",
        name: "モバイルバッテリー5",
        capacityMah: 15000,
        weightG: 200, // 上限ちょうど
        priceYen: 3490, // 上限未満
        note: "容量重視だが条件内。",
        isConditionOk: true,
    },
    {
        id: "p6",
        name: "モバイルバッテリー6",
        capacityMah: 8000, // ❌容量NG
        weightG: 160,
        priceYen: 2480,
        note: "安いが容量不足。",
        isConditionOk: false,
    },
];

function isConditionOk(p: Product) {
    return (
        p.capacityMah >= CONDITION.minMah &&
        p.weightG <= CONDITION.maxWeightG &&
        p.priceYen <= CONDITION.maxPriceYen
    );
}

export default async function ProtoV0C1ProductsPage({ searchParams }: Props) {
    const sp = (await searchParams) ?? {};
    const variant = sp.variant === "dp" ? "dp" : "control";
    const isDP = variant === "dp";

    return (
        <div className="space-y-4">
            <h1 className="text-xl font-bold">カテゴリー1 / 商品選択（{variant}）</h1>

            {/* 課題指示（一覧で条件を明示） */}
            <div className="rounded-lg border p-4 text-sm space-y-1">
                <div className="font-semibold">課題：条件を満たす商品を購入してください</div>
                <div className="text-gray-700">
                    条件：{CONDITION.minMah.toLocaleString()}mAh以上 /{" "}
                    {CONDITION.maxWeightG}g以下 / ¥{CONDITION.maxPriceYen.toLocaleString()}
                    以下
                </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
                {trial1Products.map((p) => {
                    const ok = isConditionOk(p);
                    const isFeatured = isDP && p.isTarget;

                    return (
                        <div
                            key={p.id}
                            className={[
                                "rounded-lg border p-3",
                                isFeatured ? "border-2 shadow-md" : "",
                            ].join(" ")}
                        >
                            <div className="flex items-start justify-between gap-2">
                                <div className="font-semibold">{p.name}</div>
                                {isFeatured && (
                                    <span className="rounded-full border px-2 py-0.5 text-xs">
                                        おすすめ
                                    </span>
                                )}
                            </div>

                            {/* 一覧カードに容量/重さ/価格を全表示（省略DPと混ざらない） */}
                            <div className="mt-2 text-sm text-gray-700 space-y-0.5">
                                <div>容量：{p.capacityMah.toLocaleString()}mAh</div>
                                <div>重さ：{p.weightG}g</div>
                                <div>価格：¥{p.priceYen.toLocaleString()}</div>
                            </div>

                            {/* デバック */}
                            <div className="mt-2 text-xs text-gray-500">
                                ※ 判定：{ok ? "OK" : "NG"}
                            </div>

                            <div className="mt-3">
                                <Link
                                    href={`/proto/v0/c1/shipping?variant=${variant}&productId=${p.id}&productPrice=${p.priceYen}`}
                                    className="inline-block rounded-md border px-3 py-2 text-sm hover:bg-gray-50"
                                >
                                    この商品を選ぶ →
                                </Link>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="text-sm">
                <Link href="/proto/v0" className="hover:underline">
                    ← v0トップへ戻る
                </Link>
            </div>
        </div>
    );
}