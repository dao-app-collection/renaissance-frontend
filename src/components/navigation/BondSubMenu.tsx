import clsx from "clsx"
import Link from "next/link"
import { useRouter } from "next/router"

import { prettify } from "@helper/money"
import useBonds from "@hooks/bondData"

function BondSubMenu() {
  const { bonds } = useBonds()
  const { asPath } = useRouter()

  return (
    <div className="hidden mt-2 space-y-3 xl:block">
      <div className="grid grid-cols-2">
        <div className="text-dark-600 text-left">Name</div>
        <div className="text-dark-600 text-right">ROI</div>
      </div>
      {bonds.map((item) => {
        const href = `/bond/${item.name}`
        return (
          <Link key={item.name} href={href} passHref={true}>
            <div
              className={clsx(
                asPath === href
                  ? "px-1.5 py-1 bg-gray-600 rounded-md font-bold"
                  : "text-white hover:text-dark-300 dark:text-dark2-300 dark:hover:text-dark2-200",
                "flex items-baseline justify-between text-sm font-medium gap-2 tracking-2% hover:cursor-pointer"
              )}
              data-cy={`sidebar-${item.name}-link`}
            >
              <span className="block capitalize">
                {item.name
                  .split("_")
                  .join("-")
                  .toUpperCase()
                  .replace("-LP", " LP")}
              </span>
              <span className="block">
                {prettify(item.bondDiscount * 100)}%
              </span>
            </div>
          </Link>
        )
      })}
    </div>
  )
}

export default BondSubMenu
