import Link from "next/link"

import Skeleton from "@components/ui/Skeleton"
import { prettify } from "@helper"
import useBonds from "@hooks/bondData"

export default function BondTable() {
  const { bonds } = useBonds()
  return (
    <div className="flex flex-col">
      <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="inline-block min-w-full py-3 align-middle sm:px-6 lg:px-8">
          <div className="">
            <table className="min-w-full divide-y divide-dark-1000">
              <thead className="">
                <tr className="text-sm uppercase text-dark-300 tracking-2%">
                  <th
                    scope="col"
                    className="px-6 py-3 text-xs font-medium tracking-wider text-left text-dark-100"
                  >
                    Bond
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-xs font-medium tracking-wider text-center text-dark-100"
                  >
                    Price
                  </th>

                  <th
                    scope="col"
                    className="px-6 py-3 text-xs font-medium tracking-wider text-center text-dark-100"
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
              <tbody>
                {bonds.map((bond: any) => {
                  const BondIcon = bond.bondIconSvg
                  const isBondLoading = !bond.bondPrice ?? true
                  const href = `/bond/${bond.name}`

                  if (isBondLoading)
                    return (
                      <tr key={bond.name}>
                        <td className="px-6 py-4 font-medium text-white whitespace-nowrap">
                          <Skeleton height={20} />
                        </td>

                        <td className="px-6 py-4 font-medium text-white uppercase whitespace-nowrap ">
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
                    <Link key={bond.name} href={href} passHref={true}>
                    <tr key={bond.name} className="transition duration-300 ease-in-out hover:bg-gray-600">
                      <td className="py-4 font-medium text-white uppercase whitespace-nowrap flex items-stretch">
                      <BondIcon className="w-20 h-8" />
                        {bond.name.split("_").join(" ")}
                      </td>
                      <td className="px-6 py-4 font-medium text-white whitespace-nowrap text-center">
                        ${prettify(bond.bondPrice)}
                      </td>

                      <td className="px-6 py-4 font-medium text-white whitespace-nowrap text-center">
                        {prettify(bond.bondDiscount * 100)}%
                      </td>

                      <td className="px-6 py-4 font-medium text-right text-white whitespace-nowrap">
                        ${prettify(bond.purchased)}
                      </td>
                    </tr>
                    </Link>
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
