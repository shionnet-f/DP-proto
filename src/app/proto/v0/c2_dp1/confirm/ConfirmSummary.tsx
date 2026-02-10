"use client";

import { useState } from "react";

type Props = {
  isDP: boolean;

  shippingId?: string;
  shippingTitle: string;
  shippingPrice: number;

  options: string[];
  optionsPrice: number;

  total: number;
};

function yen(n: number) {
  return new Intl.NumberFormat("ja-JP").format(n);
}

function labelOpt(o: string) {
  if (o === "insurance") return "配送補償";
  if (o === "giftwrap") return "ギフト包装";
  return o;
}

export default function ConfirmSummary({
  isDP,
  shippingId,
  shippingTitle,
  shippingPrice,
  options,
  optionsPrice,
  total,
}: Props) {
  const [open, setOpen] = useState(!isDP); // dpは閉、controlは開

  return (
    <section className="rounded-lg border bg-white p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="text-sm font-semibold">合計金額</div>
        <div className="text-base font-semibold">¥{yen(total)}</div>
      </div>

      {/* DP：内訳を折りたたみ（初期は閉） */}
      {isDP && (
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="text-sm text-blue-600 hover:underline"
        >
          {open ? "内訳を閉じる" : "内訳を確認する"}
        </button>
      )}

      {/* Control：内訳は常に表示（open=true） */}
      {open && (
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">配送方法</span>
            <span>{shippingTitle}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-600">配送料</span>
            <span>+¥{yen(shippingPrice)}</span>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between">
              <span className="text-gray-600">オプション</span>
              <span>+¥{yen(optionsPrice)}</span>
            </div>

            {options.length === 0 ? (
              <div className="text-gray-600 text-xs">なし</div>
            ) : (
              <ul className="list-disc pl-5 text-xs text-gray-600">
                {options.map((o) => (
                  <li key={o}>{labelOpt(o)}</li>
                ))}
              </ul>
            )}
          </div>

          {/* c2: shipping未選択を明示 */}
          {!shippingId && (
            <p className="text-xs text-gray-500">
              ※配送方法が未選択です（配送料は0円として計算しています）
            </p>
          )}
        </div>
      )}

      {/* DP時の補助文（受動的省略：見ようと思えば見れる） */}
      {isDP && !open && (
        <p className="text-xs text-gray-500">
          ※詳細（配送料・オプション）を確認できます
        </p>
      )}
    </section>
  );
}
