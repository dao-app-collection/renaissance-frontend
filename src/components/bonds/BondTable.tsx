import { ArrowRightIcon } from "@heroicons/react/outline"
import Link from "next/link"

import Skeleton from "@components/ui/Skeleton"
import { prettify } from "@helper"
import useBonds from "@hooks/bondData"

export default function BondTable() {
  const { bonds } = useBonds()
  return (
    <div className="flex flex-col">
      <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
          <div className="overflow-hidden">
            <table className="min-w-full">
              <thead className="">
                <tr className="text-sm uppercase text-dark-300 tracking-2%">
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">Pair Image</span>
                  </th>

                  <th
                    scope="col"
                    className="px-6 py-3 text-xs font-medium tracking-wider text-left text-dark-100"
                  >
                    Bond
                  </th>

                  <th
                    scope="col"
                    className="px-6 py-3 text-xs font-medium tracking-wider text-left text-dark-100"
                  >
                    Price
                  </th>

                  <th
                    scope="col"
                    className="px-6 py-3 text-xs font-medium tracking-wider text-left text-dark-100"
                  >
                    Roi
                  </th>

                  <th
                    scope="col"
                    className="px-6 py-3 text-xs font-medium tracking-wider text-right text-dark-100"
                  >
                    Purchased
                  </th>

                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">Bond</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {bonds.map((bond: any) => {
                  const BondIcon = bond.bondIconSvg
                  const isBondLoading = !bond.bondPrice ?? true
                  if (isBondLoading)
                    return (
                      <tr key={bond.name} className="bg-dark-1000">
                        <td className="px-6 py-4 font-medium text-white whitespace-nowrap">
                          <Skeleton height={20} />
                        </td>

                        <td className="px-6 py-4 font-medium text-white uppercase whitespace-nowrap">
                          <Skeleton height={20} />
                        </td>

                        <td className="px-6 py-4 font-medium text-white whitespace-nowrap">
                          <Skeleton height={20} />
                        </td>

                        <td className="px-6 py-4 font-medium text-white whitespace-nowrap">
                          <Skeleton height={20} />
                        </td>

                        <td className="px-6 py-4 font-medium text-right text-white whitespace-nowrap">
                          <Skeleton height={20} />
                        </td>

                        <td className="px-6 py-4 text-right whitespace-nowrap">
                          <Skeleton height={20} />
                        </td>
                      </tr>
                    )
                  return (
                    <tr key={bond.name} className="bg-dark-1000">
                      <td className="px-6 py-4 font-medium text-white whitespace-nowrap">
                        {/* {bond.image}  */}
                        <BondIcon className="w-20 h-8" />
                      </td>

                      <td className="px-6 py-4 font-medium text-white uppercase whitespace-nowrap">
                        {bond.name.split("_").join(" ")}
                      </td>

                      <td className="px-6 py-4 font-medium text-white whitespace-nowrap">
                        ${prettify(bond.bondPrice)}
                      </td>

                      <td className="px-6 py-4 font-medium text-white whitespace-nowrap">
                        {prettify(bond.bondDiscount * 100)}%
                      </td>

                      <td className="px-6 py-4 font-medium text-right text-white whitespace-nowrap">
                        ${prettify(bond.purchased)}
                      </td>

                      <td className="px-6 py-4 text-right whitespace-nowrap">
                        <Link href={`/bond/${bond.bond}`}>
                          <a className="inline-flex items-center text-sm font-medium text-orange-600 gap-2 group">
                            <span>Bond</span>
                            <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition transform" />
                          </a>
                        </Link>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
