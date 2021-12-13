import clsx from "clsx"
import Link from "next/link"
import { useRouter } from "next/router"

import { prettify } from "@helper/money"
import useBonds from "@hooks/bondData"

function BondSubMenu() {
  const { bonds } = useBonds()
  const { asPath } = useRouter()

  return (
    <div className="hidden mt-4 space-y-3 xl:block">
      {bonds.map((item) => {
        const href = `/bond/${item.name}`
        return (
          <Link key={item.name} href={href} passHref={true}>
            <div
              className={clsx(
                asPath === href
                  ? "text-orange-600 font-bold"
                  : "text-dark-100 hover:text-dark-300 dark:text-dark2-300 dark:hover:text-dark2-200",
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
