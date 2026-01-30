// カテゴリー1(c1: category 1)
// 積極的な誤解
import Link from "next/link";

export default function ProtoV0TopPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold">プロトタイプ_v0</h1>

      <div className="rounded-lg border p-4">
        <h2 className="font-semibold">カテゴリー</h2>

        <ul className="mt-2 list-inside list-disc space-y-3">
          <li>
            <span className="text-gray-700">分類1：積極的な誤解を招く行為</span>

            <ul className="mt-2 list-inside list-disc space-y-1 pl-4">
              {/* <li>
                                <Link
                                    href="/proto/v0/c1/products?variant=control"
                                    className="hover:underline"
                                >
                                    [ Control ]
                                </Link>
                            </li> */}
              <li>
                <Link
                  href="/proto/v0/c1/products?variant=dp"
                  className="hover:underline"
                >
                  [ Deceptive Patterns ]
                </Link>
              </li>
            </ul>
          </li>

          <li>
            <span className="text-gray-700">分類2：受動的な誤解を招く省略</span>

            <ul className="mt-2 list-inside list-disc space-y-1 pl-4">
              {/* <li>
                                <Link
                                    href="/proto/v0/c1/products?variant=control"
                                    className="hover:underline"
                                >
                                    [ Control ]
                                </Link>
                            </li> */}
              <li>
                <Link href="/proto/v0/c2/products" className="hover:underline">
                  [ Deceptive Patterns ]
                </Link>
              </li>
            </ul>
          </li>
          <li className="text-gray-500">分類3：好ましくない押しつけ</li>
          <li className="text-gray-500">分類4：好ましくない制約</li>
        </ul>
      </div>
    </div>
  );
}
