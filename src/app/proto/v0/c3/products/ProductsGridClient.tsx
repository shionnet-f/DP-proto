"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import ProductDetailModal from "./ProductDetailModal";
import type { Product } from "./page";

type Props = {
  products: Product[];
  variant: "control" | "dp";
  isDP: boolean;
};

export default function ProductsGridClient({ products, variant, isDP }: Props) {
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

            {/* dpのみ：社会的証明（押しつけ） */}
            {isDP && p.socialProofLabel ? (
              <div className="mt-2 inline-flex rounded-full bg-orange-100 px-2 py-0.5 text-xs font-medium text-orange-700">
                {p.socialProofLabel}
              </div>
            ) : null}

            {/* 本文 */}
            <div className="mt-3 flex gap-3">
              <div className="h-16 w-16 shrink-0 rounded-md bg-gray-200" />

              <div className="text-sm text-gray-700 space-y-0.5">
                <div>容量：{p.capacityMah.toLocaleString()}mAh</div>
                <div>重さ：{p.weightG}g</div>
                <div>価格：¥{p.priceYen.toLocaleString()}</div>
              </div>
            </div>

            {/* 操作（c2と同様：モーダル見なくても次へ行ける） */}
            <div className="mt-4 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setOpenId(p.id)}
                className="rounded-md border px-3 py-2 text-sm hover:bg-gray-50"
              >
                詳細
              </button>

              <Link
                href={`/proto/v0/c3/shipping?variant=${variant}&productId=${p.id}&productPrice=${p.priceYen}`}
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
