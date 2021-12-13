import { Fragment } from "react"

import { Dialog, Transition } from "@headlessui/react"
import { XIcon } from "@heroicons/react/outline"
import { useWeb3React } from "@web3-react/core"
import clsx from "clsx"
import Link from "next/link"
import { useRouter } from "next/router"

import ConnectButton from "@components/ConnectButton"
import DiscordIcon from "@components/customicons/DiscordIcon"
import MediumIcon from "@components/customicons/MediumIcon"
import TwitterIcon from "@components/customicons/TwitterIcon"
import { NavigationItem } from "@typings"

interface MobileMenuProps {
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
  navigation: NavigationItem[]
}

function MobileMenu({
  sidebarOpen,
  setSidebarOpen,
  navigation,
}: MobileMenuProps) {
  const { asPath } = useRouter()
  const { active, deactivate } = useWeb3React()

  return (
    <Transition.Root show={sidebarOpen} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 z-40 flex lg:hidden"
        onClose={setSidebarOpen}
      >
        <Transition.Child
          as={Fragment}
          enter="transition-opacity ease-linear duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity ease-linear duration-300"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Dialog.Overlay className="fixed inset-0 bg-gray-600 bg-opacity-75" />
        </Transition.Child>
        <Transition.Child
          as={Fragment}
          enter="transition ease-in-out duration-300 transform"
          enterFrom="-translate-x-full"
          enterTo="translate-x-0"
          leave="transition ease-in-out duration-300 transform"
          leaveFrom="translate-x-0"
          leaveTo="-translate-x-full"
        >
          <div className="relative flex flex-col flex-1 w-full max-w-xs bg-beige-100">
            <Transition.Child
              as={Fragment}
              enter="ease-in-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in-out duration-300"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="absolute top-0 right-0 pt-2 -mr-12">
                <button
                  type="button"
                  className="flex items-center justify-center w-10 h-10 ml-1 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                  onClick={() => setSidebarOpen(false)}
                >
                  <span className="sr-only">Close sidebar</span>
                  <XIcon className="w-6 h-6 text-white" aria-hidden="true" />
                </button>
              </div>
            </Transition.Child>

            <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
              <div className="flex items-center flex-shrink-0 px-4">
                <img className="w-auto h-8" src="/logo.svg" alt="Workflow" />
              </div>

              <nav className="px-4 mt-5 space-y-4">
                {navigation.map((item) => (
                  <div key={item.name}>
                    <Link key={item.name} href={item.href}>
                      <a
                        className={clsx(
                          asPath === item.href
                            ? "text-orange-600 font-bold"
                            : "text-dark-900 font-medium",
                          "text-xl block"
                        )}
                      >
                        {item.name}
                      </a>
                    </Link>
                    {item?.sub && <>{item.sub}</>}
                  </div>
                ))}

                <ConnectButton />

                {active && (
                  <button
                    className="mt-1 font-medium text-orange-600 tracking-2% md:text-sm hover:opacity-80 transition"
                    onClick={deactivate}
                  >
                    Disconnect
                  </button>
                )}
              </nav>
            </div>

            <div className="flex justify-between px-10 pb-8">
              <a
                href="https://discord.gg/renaissancedao"
                target="_blank"
                rel="noreferrer"
              >
                <DiscordIcon className="w-8 h-8 text-orange-600 lg:w-7 lg:h-7" />
              </a>

              <a
                href="https://twitter.com/renaissancedao"
                target="_blank"
                rel="noreferrer"
              >
                <TwitterIcon className="w-8 h-8 text-orange-600 lg:w-7 lg:h-7" />
              </a>

              <a
                href="https://medium.com/@DAORenaissance"
                target="_blank"
                rel="noreferrer"
              >
                <MediumIcon className="w-8 h-8 text-orange-600 lg:w-7 lg:h-7" />
              </a>
            </div>
          </div>
        </Transition.Child>

        <div className="flex-shrink-0 w-14">
          {/* Force sidebar to shrink to fit close icon */}
        </div>
      </Dialog>
    </Transition.Root>
  )
}

export default MobileMenu
