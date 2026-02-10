// 商品ページ（デザイン確定・Server Component）
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
  maxPriceYen: 4000,
} as const;

export const trial1Products: Product[] = [
  {
    id: "p1",
    name: "モバイルバッテリー1",
    capacityMah: 10000,
    weightG: 189,
    priceYen: 3180,
    note: "バランス型。通学・外出向き。",
    isTarget: true,
    isConditionOk: true,
  },
  {
    id: "p2",
    name: "モバイルバッテリー2",
    capacityMah: 10000,
    weightG: 175,
    priceYen: 2880,
    note: "軽量寄りで持ち運び重視。",
    isConditionOk: true,
  },
  {
    id: "p3",
    name: "モバイルバッテリー3",
    capacityMah: 12000,
    weightG: 205,
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
    weightG: 200,
    priceYen: 3490,
    note: "容量重視だが条件内。",
    isConditionOk: true,
  },
  {
    id: "p6",
    name: "モバイルバッテリー6",
    capacityMah: 8000,
    weightG: 160,
    priceYen: 2380,
    note: "安いが容量不足。",
    isConditionOk: false,
  },
];

export default async function ProtoV0C1ProductsPage({ searchParams }: Props) {
  const sp = (await searchParams) ?? {};
  const variant = sp.variant === "dp" ? "dp" : "control";
  const isDP = variant === "dp";

  return (
    <main className="mx-auto max-w-6xl px-6 space-y-6">
      <header className="space-y-2">
        <h1 className="text-xl font-bold">
          カテゴリー1 / 商品選択（{variant}）
        </h1>

        {/* 課題指示 */}
        <div className="rounded-lg border p-4 text-sm space-y-1">
          <div className="font-semibold">
            課題：条件を満たす商品を購入してください
          </div>
          <div className="text-gray-700">
            条件：{CONDITION.minMah.toLocaleString()}mAh以上 /{" "}
            {CONDITION.maxWeightG}g以下 / ¥
            {CONDITION.maxPriceYen.toLocaleString()}以下
          </div>
        </div>
      </header>

      {/* 商品グリッド */}
      <div className="grid grid-cols-3 grid-rows-3 gap-4">
        {trial1Products.map((p) => {
          const isFeatured = isDP && p.isTarget;

          return (
            <div
              key={p.id}
              className={[
                "rounded-lg border bg-white",
                isFeatured
                  ? "col-span-2 row-span-2 border-2 shadow-lg p-4"
                  : "p-3",
              ].join(" ")}
            >
              {/* タイトル + おすすめ */}
              <div className="flex items-start justify-between gap-2">
                <div className="font-semibold">{p.name}</div>
                {isFeatured && (
                  <span className="rounded-full bg-orange-100 text-orange-700 px-2 py-0.5 text-xs font-medium">
                    おすすめ
                  </span>
                )}
              </div>

              {/* 本文 */}
              <div className="mt-3 flex gap-3">
                {/* 画像ダミー */}
                <div className="h-16 w-16 shrink-0 rounded-md bg-gray-200" />

                {/* 情報 */}
                <div className="text-sm text-gray-700 space-y-0.5">
                  <div>容量：{p.capacityMah.toLocaleString()}mAh</div>
                  <div>重さ：{p.weightG}g</div>
                  <div>価格：¥{p.priceYen.toLocaleString()}</div>
                  {/* <div className="text-xs text-gray-500">{p.note}</div> */}
                </div>
              </div>

              {/* ボタン */}
              <div className="mt-4 flex justify-end">
                <Link
                  href={`/proto/v0/c1_dp1/shipping?variant=${variant}&productId=${p.id}&productPrice=${p.priceYen}`}
                  className="rounded-md border px-3 py-2 text-sm hover:bg-gray-50"
                >
                  購入へ
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      <footer className="text-sm">
        <Link href="/proto/v0" className="hover:underline">
          ← v0トップへ戻る
        </Link>
      </footer>
    </main>
  );
}
