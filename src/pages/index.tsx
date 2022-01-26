import React from "react"

import Link from "next/link";
import { useSelector } from "react-redux";

import { allBondsMap } from "@helper/bonds/allBonds";


export default function Home() {

  const isBondLoading = useSelector(
    (state: any) => state.bonding.loading ?? true
  )

  const marketPrice = useSelector((state: any) => {
    return state.app.marketPrice
  })

  const treasuryBalance = useSelector((state: any) => {
    if (state.bonding.loading == false) {
      let tokenBalances = 0
      for (const bond in allBondsMap) {
        if (state.bonding[bond]) {
          tokenBalances += state.bonding[bond].purchased
        }
      }
      return tokenBalances
    }
  })
  
  return (
  <div >
    <LandingFront/>
    {/*
    <div className="">

        </div>
            <div className="flex flex-wrap flex justify-center py-7 rounded-md bg-black text-sm font-medium text-dark-100 flex text-center">
      <div className="w-1/3 px-20">Treasury Balance
        <div className="mt-1 text-xl font-medium text-white">{
                <>
                  {isBondLoading ? (
                    <Skeleton height={40} width={200} />
                  ) : (
                    "$" + prettify(treasuryBalance)
                  )}
                </>
              }</div>
      </div>
      <div className="w-1/3 px-20">ART Price
        <div className="mt-1 text-xl font-medium text-white">
        {
                <>
                  {isBondLoading ? (
                    <Skeleton height={40} width={200} />
                  ) : (
                    "$" + prettify(marketPrice)
                  )}
                </>
              }
        </div>
      </div>
      <div className="w-1/3 px-20">NFT Pre-sale Price</div>
    </div>
                */}
    <div className="bg-black">
    <div className="flex justify-center py-6 text-white text-xl"> 
        <p>PARTNERSHIPS</p>
    </div>
    <div className="py-4 px-10 flex flex-rows justify-between">
        <div>
          <img src="/images/connectors/near_logo_wht.svg" alt="Near"  width={200} height={50} />
        </div>
        <div>
          <img src="/images/connectors/aurora-horiz-rev.svg" alt="Aurora"  width={220} height={50} />
        </div>
        <div className="py-4">
          <img src="/images/connectors/frax.png" alt="Frax"  width={160} height={20} />
        </div>
      </div>
      


      <div className="py-10 px-8 grid grid-cols-2 gap-4 text-white">
        <div className="px-4 py-4 border-gray-600 border rounded-md font-medium text-2xl">Finance
          <div className="text-sm py-7">
            <h5>Renaissance is a community-owned financial tool for the better future of NFTs. We Believe in decentralization of art.</h5>
          </div>
          <div className="flex items-stretch space-x-6">
            <div className=" mt-2 px-4 py-2 text-center items-center text-black font-bold text-xs bg-green-500 rounded-md">
              <button > Bond Now</button>
              </div>
          </div>
        </div>
        <div className="px-4 py-4 border-gray-600 border rounded-md font-medium text-2xl">NFT
        <div className="text-sm py-7">
            <h5>Reserve currency protocol for community ownership of NFTs. We enable exchange of fractionalized NTFs.</h5>
          </div>
          <div className="flex items-stretch space-x-3">
            <div className=" mt-2 py-2 px-3 text-center items-center text-black font-bold text-xs bg-green-500 rounded-md">
              <button > Pre-sale</button>
            </div>
            <div className="mt-2 px-4 py-2 text-center text-black font-black text-xs bg-white rounded-md">
              <button>Marketplace
                <span className="text-gray-600">  comming soon</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      </div>
  </div>
  )
}

function LandingFront() {
  return (
    <div className="relative flex bg-black">
      
      <img src="/images/connectors/renaissance.svg" alt="RenaissanceDao"/>
    
        <div className="absolute inset-0">
          <nav className="flex shadow-lg bg-opacity-100 w-screen">
            <div className="items-center px-8">
              <Link href="#">
                <div className="py-3 px-10 text-2xl font-semibold text-white ">Renaissance</div>
              </Link>
            </div>
            <div className="hidden md:flex  text-lg items-center pr-8 space-x-6">
                    <a href="#" className="px-4 mt-2 text-white font-semibold hover:text-green-500 transition duration-300 cursor-pointer">Marketplace</a>
                    <a href="#" className="px-4 mt-2 text-white font-semibold hover:text-green-500 transition duration-300 cursor-pointer">Bond</a>
                    <a href="#" className="px-4 mt-2 text-white font-semibold hover:text-green-500 transition duration-300 cursor-pointer">Stake</a>
                    <a href="#" className="px-4 mt-2 text-white font-semibold hover:text-green-500 transition duration-300 cursor-pointer"> FAQ</a>
            </div>
            <div className="md:hidden flex px-10">
              <button className="outline-none mobile-menu-button">
                <svg className=" w-6 h-6 text-gray-500 hover:text-green-500 "
                  x-show="!showMenu"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="3"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M4 6h16M4 12h16M4 18h16"></path>
                </svg>
              </button>
            </div>
            
            <div className="hidden mobile-menu">
              <ul className="">
                <li className="active"><a href="index.html" className="block text-sm px-2 py-4 text-white bg-green-500 font-semibold">Home</a></li>
                <li><a href="#services" className="block text-sm px-2 py-4 hover:bg-green-500 transition duration-300">Services</a></li>
                <li><a href="#about" className="block text-sm px-2 py-4 hover:bg-green-500 transition duration-300">About</a></li>
                <li><a href="#contact" className="block text-sm px-2 py-4 hover:bg-green-500 transition duration-300">Contact Us</a></li>
              </ul>
            </div>
          </nav>
        </div>
        <div className="absolute flex items-end py-10 justify-start px-10 inset-0">
          <Link href="/whitelist">
          <button className="px-3 py-2 text-md bg-blue-600 text-white rounded-md font-bold">Enter App</button>
          </Link>
        </div>
    </div>
    
    
  )
}