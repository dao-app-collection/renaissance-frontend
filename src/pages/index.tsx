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

    <div className="flex justify-center py-4 text-white"> 
        <p>PARTNERSHIPS</p>
    </div>


    <div className="flex ">
        <div>
          <img src="/images/connectors/near_logo_wht.svg" alt="Near"  width={100} height={50} />
        </div>
        <div>
          <img src="/images/connectors/aurora-horiz-rev.svg" alt="Aurora"  width={120} height={50} />
        </div>
        <div>
          <img src="/images/connectors/frax.png" alt="Frax"  width={20} height={20} />
        </div>
      </div>
  </div>
  )
}

function LandingFront() {
  return (
    <div className="relative rounded-lg shadow-lg">
      <img src="/images/connectors/renassance.jpg" alt="RenaissanceDao" className="object-cover"/>
      <div className="absolute top-0 left-0 px-10">
        <nav className="flex flex-row px-10 py-4 mx-auto">
            <Link href="/">
            <span className="text-2xl whitespace-nowrap text-white font-bold pr-8">Renaissance</span>
          </Link>
          <div className="container mx-auto flex flex-wrap items-center justify-between">
            <ul className="flex flex-row mt-2">
              <li>
                <a href="#" className="py-1 px-10 text-white" aria-current="page">Marketplace</a>
              </li>
              <li>
                <a href="#" className="py-1 px-10 text-white" aria-current="page">Bond</a>
              </li>
              <li>
                <a href="#" className="py-1 px-10 text-white" aria-current="page">Stake</a>
              </li>
              <li>
                <a href="#" className="py-1 px-10 text-white" aria-current="page">FAQ</a>
              </li>
            </ul>
          </div>
        </nav>
      <div className="container absolute px-10 ">
          <div className="py-10 px-10 py"></div>
          <h2 className="px-20 text-4xl font-bold tracking-tight text-white">The Dencentralized</h2>
          <h2 className="px-20 mb-6 text-4xl font-bold tracking-tight text-white">NFT Reserve Currency</h2>
          <p className="px-20 leading-normal text-white">Renaissance is a community-owned financial tool for the </p>
          <p className="px-20 leading-normal text-white">better future of NFTs. We believe in decentralization of art.</p>
          <div className="px-20 py-7">
          <Link href="/whitelist">
            <button className="bg-blue-600 px-6 py-3 text-white font-bold text-md rounded-md">Enter App</button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}