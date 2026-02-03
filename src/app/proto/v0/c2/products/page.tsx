import Link from "next/link";
import ProductsGridClient from "./ProductsGridClient";

type Props = {
  searchParams?: Promise<{ variant?: string }>;
};

export type Product = {
  id: string;
  name: string;
  capacityMah: number; // 表示条件
  weightG: number; // 隠し条件（dpではカード非表示）
  priceYen: number; // 表示条件
  note: string;
  isConditionOk: boolean; // 全条件OK（内部判定用：UIでは出さない）
};

const CONDITION = {
  minMah: 10000,
  maxWeightG: 200,
  maxPriceYen: 4000,
} as const;

/**
 * 設計意図（強調なし・省略のみ）
 * - dp: カードから「重さ」を省略（モーダルのみ）
 * - control: カードにも「重さ」を表示
 * - 4つ目(p4)は「価格:同じor安い」「重さ:同じor軽い」寄りで真の最適に
 * - 2/3は表示条件はOKだが、隠し条件(重さ)でNG → 省略に騙される枠
 */
export const trial2Products: Product[] = [
  {
    id: "p1",
    name: "モバイルバッテリー1",
    capacityMah: 12000,
    weightG: 195,
    priceYen: 3200,
    note: "全条件OKの比較対象。",
    isConditionOk: true,
  },
  {
    id: "p2",
    name: "モバイルバッテリー2",
    capacityMah: 15000,
    weightG: 210, // 隠し条件NG（重い）
    priceYen: 3200, // 表示条件OK
    note: "容量・価格は良さそうだが、重さが条件外。",
    isConditionOk: false,
  },
  {
    id: "p3",
    name: "モバイルバッテリー3",
    capacityMah: 15000,
    weightG: 205, // 隠し条件NG（重い）
    priceYen: 3150, // 表示条件OK
    note: "表示条件は満たすが、隠し条件で条件外。",
    isConditionOk: false,
  },
  {
    id: "p4",
    name: "モバイルバッテリー4",
    capacityMah: 10000, // 最低ラインだが条件OK
    weightG: 185, // 軽い（真の最適）
    priceYen: 3100, // 安い（真の最適）
    note: "全条件OK（真の最適）。",
    isConditionOk: true,
  },
  {
    id: "p5",
    name: "モバイルバッテリー5",
    capacityMah: 8000, // 表示条件NG（容量不足）
    weightG: 170,
    priceYen: 2800,
    note: "安いが容量不足。",
    isConditionOk: false,
  },
  {
    id: "p6",
    name: "モバイルバッテリー6",
    capacityMah: 10000,
    weightG: 190,
    priceYen: 4200, // 表示条件NG（価格超過）
    note: "容量はOKだが価格が条件外。",
    isConditionOk: false,
  },
];

export default async function ProtoV0C2ProductsPage({ searchParams }: Props) {
  const sp = (await searchParams) ?? {};
  const variant = sp.variant === "dp" ? "dp" : "control";
  const isDP = variant === "dp";

  return (
    <main className="mx-auto max-w-6xl px-6 space-y-6">
      <header className="space-y-2">
        <h1 className="text-xl font-bold">
          カテゴリー2 / 商品選択（{variant}）
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
          <div className="text-gray-500 text-xs">
            ※ 商品の詳細情報は「詳細」から確認できます
          </div>
        </div>
      </header>

      {/* 2行×3列（= grid-cols-3、商品6個で2段になる） */}
      <ProductsGridClient
        products={trial2Products}
        variant={variant}
        showWeightOnCard={!isDP} // controlのみカードに重さを表示
      />

      <footer className="text-sm">
        <Link href="/proto/v0" className="hover:underline">
          ← v0トップへ戻る
        </Link>
      </footer>
    </main>
  );
}
