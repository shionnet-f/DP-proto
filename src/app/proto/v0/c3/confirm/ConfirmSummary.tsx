"use client";

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
  if (o === "warranty") return "保証（30日）";
  if (o === "newsletter") return "お得な情報のメールを受け取る";
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
  return (
    <section className="rounded-lg border bg-white p-4 space-y-3">
      {/* c3（押しつけ）：肯定的文言 */}
      {isDP && (
        <div className="rounded-lg border bg-green-50 p-3 text-sm text-green-900">
          <div className="font-semibold">この内容で問題ありません</div>
          <div className="mt-1 text-xs text-green-800">
            注文確定ボタンを押すと購入が完了します
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div className="text-sm font-semibold">合計金額</div>
        <div className="text-base font-semibold">¥{yen(total)}</div>
      </div>

      {/* c3: 内訳は常に表示（c2の“折りたたみDP”は混ぜない） */}
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

        {/* shipping未選択を明示（c2踏襲） */}
        {!shippingId && (
          <p className="text-xs text-gray-500">
            ※配送方法が未選択です（配送料は0円として計算しています）
          </p>
        )}

        {/* dpでは「再確認を促す」文言を弱めにしてもOK（今回は入れない/必要なら追加） */}
      </div>
    </section>
  );
}
