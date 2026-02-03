"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import ProductDetailModal from "./ProductDetailModal";
import type { Product } from "./page";

type Props = {
  products: Product[];
  variant: "control" | "dp";
  showWeightOnCard: boolean;
};

export default function ProductsGridClient({
  products,
  variant,
  showWeightOnCard,
}: Props) {
  const [openId, setOpenId] = useState<string | null>(null);

  const activeProduct = useMemo(
    () => products.find((p) => p.id === openId) ?? null,
    [openId, products],
  );

  return (
    <>
      <div className="grid grid-cols-3 gap-4">
        {products.map((p) => (
          <div key={p.id} className="rounded-lg border bg-white p-4">
            {/* タイトル */}
            <div className="flex items-start justify-between gap-2">
              <div className="font-semibold">{p.name}</div>
            </div>

            {/* 本文 */}
            <div className="mt-3 flex gap-3">
              {/* 画像ダミー */}
              <div className="h-16 w-16 shrink-0 rounded-md bg-gray-200" />

              {/* 情報（dpでは重さを省略） */}
              <div className="text-sm text-gray-700 space-y-0.5">
                <div>容量：{p.capacityMah.toLocaleString()}mAh</div>
                {showWeightOnCard ? <div>重さ：{p.weightG}g</div> : null}
                <div>価格：¥{p.priceYen.toLocaleString()}</div>
              </div>
            </div>

            {/* 操作 */}
            <div className="mt-4 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setOpenId(p.id)}
                className="rounded-md border px-3 py-2 text-sm hover:bg-gray-50"
              >
                詳細
              </button>

              {/* 省略が効くように：モーダルを見なくても購入へ進める */}
              <Link
                href={`/proto/v0/c2/shipping?variant=${variant}&productId=${p.id}&productPrice=${p.priceYen}`}
                className="rounded-md border px-3 py-2 text-sm hover:bg-gray-50"
              >
                購入へ
              </Link>
            </div>
          </div>
        ))}
      </div>

      <ProductDetailModal
        open={!!activeProduct}
        product={activeProduct}
        onClose={() => setOpenId(null)}
      />
    </>
  );
}
