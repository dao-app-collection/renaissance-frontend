import React from "react"

import Link from "next/link";
import { useSelector } from "react-redux";

import Skeleton from "@components/ui/Skeleton";
import { prettify } from "@helper"
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
  <div>
    <nav className="flex flex-row bg-black px-10 py-4">
          <Link href="/">
          <span className="text-2xl mt-2 font-semibold whitespace-nowrap text-white font-bold">Renaissance</span>
        </Link>
      <div className="container flex flex-wrap mx-auto justify-center">
        <ul className="flex flex-row mt-2">
          <li>
            <a href="#" className="py-1 pr-8 text-white" aria-current="page">Marketplace</a>
          </li>
          <li>
            <a href="#" className="py-1 px-8 text-white" aria-current="page">Bond</a>
          </li>
          <li>
            <a href="#" className="py-1 px-8 text-white" aria-current="page">Stake</a>
          </li>
          <li>
            <a href="#" className="py-1 px-8 text-white" aria-current="page">FAQ</a>
          </li>
        </ul>
      </div>
    </nav>
    <LandingFront/>
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
    <div className="flex justify-center py-2 text-gray-500 bg-dark-1200"> 
        <p>PARTNERSHIPS</p>
        <div className="py-10"></div>
    </div>

  </div>
  )
}
function LandingFront() {


  return (
    <div className="relative overflow-hidden rounded-lg shadow-lg cursor-pointer">
      <img className="object-cover w-full h-42" src="/images/connectors/renassance.jpg" alt="RenaissanceDao"/>

      <div className="absolute top-0 left-0 px-20 py-16">
        <h4 className="mb-3 text-3xl font-bold tracking-tight text-white">The Dencentralized</h4>
        <h4 className="mb-10 text-3xl font-bold tracking-tight text-white">NFT Reserve Currency</h4>

        <p className="leading-normal text-white">Renaissance is a community-owned financial tool for </p>
        <p className="leading-normal text-white">the better future of NFTs. We believe in decentralization of art.</p>

        <div className="py-7">
        <Link href="/whitelist">
          <button className="bg-blue-600 px-6 py-3 text-white font-bold text-md rounded-md">Enter App</button>
          </Link>
        </div>
      </div>
    </div>
  );
}