import React, { useState } from "react"

import { MenuIcon } from "@heroicons/react/outline"

import LeftAside from "@components/navigation/LeftAside"
import MobileMenu from "@components/navigation/MobileMenu"
//import RightAside from "@components/navigation/RightAside"
import { NavigationItem } from "@interfaces"

const navigation_top: NavigationItem[] = [{ name: "NFTs", href: "/nfts" }]
const navigation_bot: NavigationItem[] = [
  { name: "Whitelist", href: "/whitelist" },
]

const navigation_disabled: NavigationItem[] = [
  { name: "Bond", href: "" },
  { name: "Stake", href: "" },
  { name: "fNFT Sale", href: "" },
  { name: "NFT Treasury", href: "" },
]

export default function Layout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <>
      <div>
        <MobileMenu
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          navigation_top={navigation_top}
          navigation_bot={navigation_bot}
        />
        {/* mobile navbar showing hamburger menu that opens mobile menu */}
        <div className="sticky top-0 z-10 flex items-center justify-between bg-bg px-1.5 py-1.5 lg:hidden">
          {/* <RenaissanceLogo className="w-auto h-6 text-black dark:text-white" /> */}

          <button
            type="button"
            className="inline-flex items-center justify-center w-16 h-12 text-gray-500 -ml-0.5 -mt-0.5 rounded-md hover:text-gray-600 focus:outline-none"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <MenuIcon className="w-6 h-6" aria-hidden="true" />
          </button>
        </div>

        <div className="lg:grid lg:grid-cols-10">
          <div className="hidden col-span-2 lg:block">
            <nav
              aria-label="Sidebar"
              className="sticky top-0 divide-y divide-dark-1000"
            >
              <LeftAside
                navigation_top={navigation_top}
                navigation_bot={navigation_bot}
                navigation_disabled={navigation_disabled}
              />
            </nav>
          </div>

          <main className="lg:col-span-8">
            <div className="md:px-15 lg:px-20">{children}</div>
          </main>
        </div>
      </div>
    </>
  )
}
