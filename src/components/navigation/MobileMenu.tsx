import { Fragment } from "react"

import { Dialog, Transition } from "@headlessui/react"
import { XIcon } from "@heroicons/react/outline"
import { useWeb3React } from "@web3-react/core"
import clsx from "clsx"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/router"

import ConnectButton from "@components/ConnectButton"
import { NavigationItem } from "@typings"

interface MobileMenuProps {
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
  navigation_top: NavigationItem[]
  navigation_bot: NavigationItem[]

}

function MobileMenu({
  sidebarOpen,
  setSidebarOpen,
  navigation_top,
  navigation_bot,
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
          <div className="relative flex flex-col flex-1 w-full max-w-xs bg-black">
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
              <Link href="/">
          <div className="flex items-center text-xl font-semibold text-white cursor-pointer left-4 md:flex justify-self-start col-span-1">
            <Image
              src={"/images/renaissance-logo.svg"}
              alt="logo"
              width={"32px"}
              height={"32px"}
              className="absolute"
            />
            <div className="w-4" />
            Renaissance
          </div>
        </Link>
              </div>

              <nav className="px-4 mt-5 space-y-4">
                {navigation_top.map((item) => (
                  <div key={item.name} className="hover:bg-dark-1000 rounded-md">
                    <Link key={item.name} href={item.href}>
                      <a
                        className={clsx(
                          asPath === item.href
                          ? "text-dark-1000 font-bold"
                          : "text-white font-medium",
                          "text-xl block"
                        )}
                      >
                        {item.name}
                      </a>
                    </Link>
                    {item?.sub && <>{item.sub}</>}
                  </div>
                ))}

                {navigation_bot.map((item) => (
                  <div key={item.name} className="hover:bg-dark-1000 rounded-md">
                    <Link key={item.name} href={item.href}>
                      <a
                        className={clsx(
                          asPath === item.href
                            ? "text-dark-1000 font-bold"
                            : "text-white font-medium",
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
                    className="mt-1 font-medium text-white tracking-2% md:text-sm hover:opacity-80 transition"
                    onClick={deactivate}
                  >
                    Disconnect
                  </button>
                )}
              </nav>
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
