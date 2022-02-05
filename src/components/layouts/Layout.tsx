import React, { useState } from "react"

import { MenuIcon } from "@heroicons/react/outline"

// import BondSubMenu from "@components/navigation/BondSubMenu"
import LeftAside from "@components/navigation/LeftAside"
import MobileMenu from "@components/navigation/MobileMenu"
//import RightAside from "@components/navigation/RightAside"
import { NavigationItem } from "@typings"


const navigation_top: NavigationItem[] = [

  // { name: "Pre-sale", href: "#" },
  // { name: "Listing", href: "#" },
]
const navigation_bot: NavigationItem[] = [
  // { name: "Bond", href: "/bond", sub: <BondSubMenu/>, },
  // { name: "Stake", href: "/stake" },
  { name: "Whitelist", href: "/whitelist" },
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
        <div className="sticky top-0 z-10 flex items-center justify-between bg-black px-1.5 py-1.5 lg:hidden dark:bg-dark2-800">
          {/* <RenaissanceLogo className="w-auto h-6 text-black dark:text-white" /> */}

          <button
            type="button"
            className="inline-flex items-center justify-center w-16 h-12 text-gray-500 -ml-0.5 -mt-0.5 rounded-md hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-orange-600"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <MenuIcon className="w-6 h-6" aria-hidden="true" />
          </button>
          
        </div>
        
        <div className="lg:grid 2xl:grid-cols-10 lg:grid-cols-8">       
          <div className="hidden col-span-2 lg:block">
            <nav
              aria-label="Sidebar"
              className="sticky top-0 divide-y divide-dark-1000"
            >
              <LeftAside navigation_top={navigation_top} navigation_bot={navigation_bot}/>
            </nav>
          </div>

          <main className="lg:col-span-6 xl:col-span-6">{children}</main>

        </div>
      </div>
    </>
  )
}
