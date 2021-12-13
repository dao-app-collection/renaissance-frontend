import clsx from "clsx"
import Link from "next/link"
import { useRouter } from "next/router"

import DiscordIcon from "@components/customicons/DiscordIcon"
import MediumIcon from "@components/customicons/MediumIcon"
import TwitterIcon from "@components/customicons/TwitterIcon"
import { NavigationItem } from "@typings"

function LeftAside({ navigation }: { navigation: NavigationItem[] }) {
  const { asPath } = useRouter()

  return (
    <div className="flex flex-col flex-1 h-full min-h-screen px-10 py-10 bg-dark-1500 dark:bg-dark2-800 dark:bg-none">
      <div className="flex flex-col flex-1 pb-4 overflow-y-auto">
        {/* <RenaissanceLogo className="w-auto text-black h-14 dark:text-white" /> */}

        <nav className="flex-1 px-0">
          <div className="space-y-6">
            {navigation.map((item) => (
              <div key={item.name}>
                <Link key={item.name} href={item.href}>
                  <a
                    data-cy={`sidebar-${item.name}-link`}
                    className={clsx(
                      asPath === item.href
                        ? "text-orange-600 font-semibold"
                        : "text-dark-50 dark:text-dark2-300 font-medium hover:text-dark-400 dark:hover:text-dark2-200",
                      "text-lg md:text-sm 2xl:text-lg block tracking-wider"
                    )}
                  >
                    {asPath === item.href && (
                      <div className="absolute flex items-center justify-center w-10 h-10 rounded-full bg-dark-1000 dark:bg-black dark:!hidden -right-5 transform -translate-y-1">
                        <div className="w-2 h-2 bg-orange-600 rounded-full"></div>
                      </div>
                    )}
                    {item.name}
                  </a>
                </Link>
                {item?.sub && <>{item.sub}</>}
              </div>
            ))}
          </div>
        </nav>
      </div>

      <div className="flex justify-between px-0">
        <a
          href="https://discord.gg/renaissancedao"
          target="_blank"
          rel="noreferrer"
          data-cy="desktop-sidebar-discord-link"
        >
          <DiscordIcon className="w-6 h-6 text-orange-600 lg:w-7 lg:h-7" />
        </a>

        <a
          href="https://twitter.com/daorenaissance"
          target="_blank"
          rel="noreferrer"
          data-cy="desktop-sidebar-twitter-link"
        >
          <TwitterIcon className="w-6 h-6 text-orange-600 lg:w-7 lg:h-7" />
        </a>

        <a
          href="https://medium.com/@RenaissanceDAO"
          target="_blank"
          rel="noreferrer"
          data-cy="desktop-sidebar-medium-link"
        >
          <MediumIcon className="w-6 h-6 text-orange-600 lg:w-7 lg:h-7" />
        </a>
      </div>
    </div>
  )
}

export default LeftAside
