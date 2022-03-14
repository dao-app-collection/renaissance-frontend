import clsx from "clsx"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/router"

import { NavigationItem } from "@interfaces"

function LeftAside({
  navigation_top,
  navigation_bot,
  navigation_disabled,
}: {
  navigation_top: NavigationItem[]
  navigation_bot: NavigationItem[]
  navigation_disabled: NavigationItem[]
}) {
  const { asPath } = useRouter()

  return (
    <div className="flex flex-col flex-1 h-full min-h-screen px-[40px] py-[55px] bg-scheme-600 bg-opacity-80 dark:bg-none">
      {/* <h1 className="pl-2 text-4xl font-bold text-white">R</h1> */}
      <div className="flex items-center flex-shrink-0 pb-4 pl-2">
        <Link passHref={true} href="/">
          <div className="flex items-center text-xl font-semibold text-white cursor-pointer left-4 md:flex justify-self-start col-span-1">
            <Image
              src={"/images/renaissance-logo.svg"}
              alt="logo"
              width={"40px"}
              height={"40px"}
              className="absolute"
            />
          </div>
        </Link>
      </div>
      <div className="flex flex-col flex-1 pb-4 overflow-y-auto">
        {/* <RenaissanceLogo className="w-auto text-black h-14 dark:text-white" /> */}

        <nav className="flex-1 px-0">
          <div className="pl-2 mt-5 mb-2 text-sm text-gray-400">
            NFT Marketplace
          </div>
          <div className="space-y-5">
            {navigation_top.map((item) => (
              <div key={item.name} className="m-3">
                <Link key={item.name} href={item.href}>
                  <a
                    data-cy={`sidebar-${item.name}-link`}
                    className={clsx(
                      asPath === item.href
                        ? "py-1 pl-2 rounded-md bg-dark-1250 text-white font-semibold"
                        : "pl-2 text-dark-50 dark:text-dark2-300 font-medium hover:text-dark-400 dark:hover:text-dark2-200",
                      "text-xg md:text-xg xl:text-1xl block tracking-wider"
                    )}
                  >
                    {item.name}
                  </a>
                </Link>
              </div>
            ))}
          </div>

          <hr className="mt-5 border-gray-600"></hr>

          <div className="pl-2 mt-5 mb-2 text-gray-400">Finance</div>
          <div className="space-y-5">
            {navigation_bot.map((item) => (
              <div className="m-3" key={item.name}>
                <Link key={item.name} href={item.href}>
                  <a
                    data-cy={`sidebar-${item.name}-link`}
                    className={clsx(
                      asPath === item.href
                        ? "py-1 pl-2 rounded-md bg-dark-1250 text-white font-semibold"
                        : "pl-2 text-dark-50 dark:text-dark2-300 font-medium hover:text-dark-400 dark:hover:text-dark2-200",
                      "text-xg md:text-xg xl:text-1xl block tracking-wider"
                    )}
                  >
                    {item.name}
                  </a>
                </Link>
                <div className="pl-3 ml-2 text-white">
                  {item?.sub && <>{item.sub}</>}
                </div>
              </div>
            ))}
          </div>

          {navigation_disabled.length > 0 ? (
            <div>
              <div className="pl-2 mt-5 mb-4 text-gray-400">Coming Soon</div>
              <div className="space-y-3">
                {navigation_disabled.map((item) => (
                  <div className="m-3" key={item.name}>
                    <p
                      // className={
                      // "pl-2 text-dark-50 dark:text-dark2-300 font-medium hover:text-dark-400 dark:hover:text-dark2-200",
                      // "text-xg md:text-xg xl:text-1xl block tracking-wider"
                      // }
                      className="pl-2 font-medium text-dark-400 dark:text-dark2-300 hover:text-dark-400"
                    >
                      {item.name}
                    </p>
                    <div className="pl-3 ml-2 text-white">
                      {item?.sub && <>{item.sub}</>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </nav>
      </div>
    </div>
  )
}

export default LeftAside
