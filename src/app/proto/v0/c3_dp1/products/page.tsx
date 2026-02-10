import Link from "next/link";
import ProductsGridClient from "./ProductsGridClient";

type Props = {
  searchParams?: Promise<{ variant?: string }>;
};

export type Product = {
  id: string;
  name: string;
  capacityMah: number;
  weightG: number;
  priceYen: number;
  note: string;

  // c3追加：dp時だけカードに表示する「社会的証明」
  socialProofLabel?: string;
};

const CONDITION = {
  minMah: 10000,
  maxWeightG: 200,
  maxPriceYen: 4000,
} as const;

/**
 * c3 設計意図
 * - c2のレイアウトを踏襲（2行×3列、詳細モーダル、購入へ導線）
 * - dp: 商品カードに「多くの人が選択しています」などの社会的証明を付与（押しつけ）
 * - control: 社会的証明を表示しない
 * - 商品の中身（条件OK/NG）は c2と同等のバランスで維持（UI差分の影響を見やすく）
 */
export const trial3Products: Product[] = [
  {
    id: "p1",
    name: "モバイルバッテリー1",
    capacityMah: 12000,
    weightG: 195,
    priceYen: 3200,
    note: "全条件OKの比較対象。",
    socialProofLabel: "87人が選択しています",
  },
  {
    id: "p2",
    name: "モバイルバッテリー2",
    capacityMah: 15000,
    weightG: 210,
    priceYen: 3200,
    note: "容量・価格は良さそうだが、重さが条件外。",
  },
  {
    id: "p3",
    name: "モバイルバッテリー3",
    capacityMah: 15000,
    weightG: 205,
    priceYen: 3150,
    note: "表示条件は満たすが、隠し条件で条件外。",
  },
  {
    id: "p4",
    name: "モバイルバッテリー4",
    capacityMah: 10000,
    weightG: 185,
    priceYen: 3100,
    note: "全条件OK（真の最適）。",
  },
  {
    id: "p5",
    name: "モバイルバッテリー5",
    capacityMah: 8000,
    weightG: 170,
    priceYen: 2800,
    note: "安いが容量不足。",
  },
  {
    id: "p6",
    name: "モバイルバッテリー6",
    capacityMah: 10000,
    weightG: 190,
    priceYen: 4200,
    note: "容量はOKだが価格が条件外。",
  },
];

export default async function ProtoV0C3ProductsPage({ searchParams }: Props) {
  const sp = (await searchParams) ?? {};
  const variant = sp.variant === "dp" ? "dp" : "control";
  const isDP = variant === "dp";

  return (
    <main className="mx-auto max-w-6xl px-6 space-y-6">
      <header className="space-y-2">
        <h1 className="text-xl font-bold">
          カテゴリー3 / 商品選択（{variant}）
        </h1>

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

      {/* 2行×3列 */}
      <ProductsGridClient
        products={trial3Products}
        variant={variant}
        isDP={isDP}
      />

      <footer className="text-sm">
        <Link href="/proto/v0" className="hover:underline">
          ← v0トップへ戻る
        </Link>
      </footer>
    </main>
  );
}
