import clsx from "clsx"
import Link from "next/link"
import { useRouter } from "next/router"

import { NavigationItem } from "@typings"

function LeftAside({ navigation_top, navigation_bot }: { navigation_top: NavigationItem[],navigation_bot:NavigationItem[] }) {
  const { asPath } = useRouter()

  return (
    <div className="flex flex-col flex-1 h-full min-h-screen px-4 py-10 bg-scheme-600 bg-opacity-80 dark:bg-none">
      <h1 className="pl-2 text-4xl font-bold text-white">R</h1>
      <div className="flex flex-col flex-1 pb-4 overflow-y-auto">
        {/* <RenaissanceLogo className="w-auto text-black h-14 dark:text-white" /> */}

        <nav className="flex-1 px-0">

          <div className="pl-2 mt-5 mb-1 text-gray-600">NFT Marketplace (Coming soon)</div>
          <div className="space-y-5">
            {navigation_top.map((item) => (
              
              <div key={item.name}>
                
                <Link key={item.name} href={item.href}>

                  
                  <a
                    data-cy={`sidebar-${item.name}-link`}
                    className={clsx(
                      asPath === item.href
                        ? "py-1 pl-2 rounded-md bg-scheme-bg text-white font-semibold"
                        : "pl-2 text-dark-50 dark:text-dark2-300 font-medium hover:text-dark-400 dark:hover:text-dark2-200",
                      "text-xg md:text-1xl xl:text-1xl block tracking-wider"
                    )}
                  >
                    {asPath === item.href && (
                      <div className="absolute flex items-center justify-center w-5 h-10 rounded-full bg-dark-1000 dark:bg-black dark:!hidden -right-5 transform -translate-y-1">
                        <div className="w-2 h-2 bg-orange-600 rounded-full"></div>
                      </div>
                    )}
                    {item.name}
                  </a>
                </Link>
              </div>
            ))}
          </div>
          
          <hr className="mt-5 border-gray-600"></hr>

          <div className="pl-2 mt-5 mb-1 text-gray-600">Finance</div>
          <div className="space-y-5">
            {navigation_bot.map((item) => (
              <div key={item.name}>
                <Link key={item.name} href={item.href}>                  
                  <a
                    data-cy={`sidebar-${item.name}-link`}
                    className={clsx(
                      asPath === item.href
                        ? "py-1 pl-2 rounded-md bg-dark-1000 text-white font-semibold"
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
        </nav>
      </div>
    </div>
  )
}

export default LeftAside
