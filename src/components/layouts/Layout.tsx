import React, { Fragment, useState } from "react"

import { MenuIcon } from "@heroicons/react/outline"

import BondSubMenu from "@components/navigation/BondSubMenu"
import LeftAside from "@components/navigation/LeftAside"
import MobileMenu from "@components/navigation/MobileMenu"
import RightAside from "@components/navigation/RightAside"
import { NavigationItem } from "@typings"

const navigation: NavigationItem[] = [
  { name: "Home", href: "/" },
  {
    name: "Bond",
    href: "/bond",
    sub: <BondSubMenu />,
  },
  { name: "Stake", href: "/stake" },
  // { name: "Whitelist", href: "/whitelist" },
  // { name: "Claim", href: "/claim" },
  // { name: "Reports", href: "#" },
]

export default function Layout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <>
      <div>
        <MobileMenu
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          navigation={navigation}
        />

        {/* mobile navbar showing hamburger menu that opens mobile menu */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-1.5 py-1.5 lg:hidden bg-beige-100 dark:bg-dark2-800">
          {/* <RenaissanceLogo className="w-auto h-6 text-black dark:text-white" /> */}

          <button
            type="button"
            className="inline-flex items-center justify-center w-12 h-12 text-gray-500 -ml-0.5 -mt-0.5 rounded-md hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-orange-600"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <MenuIcon className="w-6 h-6" aria-hidden="true" />
          </button>
        </div>

        <div className="lg:grid 2xl:grid-cols-layoutXL lg:grid-cols-layoutSM">
          <div className="hidden col-span-1 lg:block">
            <nav
              aria-label="Sidebar"
              className="sticky top-0 max-w-full divide-y divide-gray-300"
            >
              <LeftAside navigation={navigation} />
            </nav>
          </div>

          <main className="lg:col-span-10 xl:col-span-10">{children}</main>

          <aside className="hidden lg:block xl:col-span-1">
            <div className="sticky top-0 h-full max-h-screen py-10 overflow-hidden overflow-y-scroll bg-dark-1500">
              <div className="flex flex-col flex-1 h-full min-w-full">
                <RightAside />
              </div>
            </div>
          </aside>
        </div>
      </div>
    </>
  )
}
