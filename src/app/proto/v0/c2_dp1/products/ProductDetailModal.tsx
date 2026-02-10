"use client";

import type { Product } from "./page";

type Props = {
  open: boolean;
  product: Product | null;
  onClose: () => void;
};

export default function ProductDetailModal({ open, product, onClose }: Props) {
  if (!open || !product) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      role="dialog"
      aria-modal="true"
      aria-label="商品詳細"
      onMouseDown={onClose}
    >
      <div
        className="w-full max-w-md rounded-lg bg-white p-5 shadow-lg"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-lg font-semibold">{product.name}</div>
            <div className="text-xs text-gray-500 mt-1">
              詳細情報（条件の確認に使用できます）
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border px-2 py-1 text-sm hover:bg-gray-50"
          >
            閉じる
          </button>
        </div>

        <div className="mt-4 space-y-2 text-sm text-gray-800">
          <div className="flex justify-between">
            <span className="text-gray-600">容量</span>
            <span>{product.capacityMah.toLocaleString()}mAh</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">重さ</span>
            <span>{product.weightG}g</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">価格</span>
            <span>¥{product.priceYen.toLocaleString()}</span>
          </div>

          <div className="pt-2 text-xs text-gray-500">{product.note}</div>
        </div>

        <div className="mt-5 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border px-3 py-2 text-sm hover:bg-gray-50"
          >
            戻る
          </button>
        </div>
      </div>
    </div>
  );
}
