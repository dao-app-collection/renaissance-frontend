import { useMemo, useState } from "react"

import { ArrowLeftIcon } from "@heroicons/react/outline"
import clsx from "clsx"
import Link from "next/link"
import { useRouter } from "next/router"

import Bonding from "@components/bonds/Purchase"
import Redeem from "@components/bonds/Redeem"
import ConnectButton from "@components/ConnectButton"
import Layout from "@components/layouts/Layout"
import Skeleton from "@components/ui/Skeleton"
import { prettify } from "@helper"
import { useBonds } from "@hooks/useBonds"
import { useArtMarketPrice } from "@hooks/useMarketPrice"

function Header() {
  let marketPrice = useArtMarketPrice()
  let bonds = useBonds()
  let router = useRouter()
  const bond = useMemo(
    () => bonds.find(({ name }) => name === router.query.pair?.toString()),
    [bonds, router.query]
  )
  if (!bond.name) return null
  const bondNamePretty = bond.name
    .split("_")
    .join("-")
    .toUpperCase()
    .replace("-LP", " LP")
  let BondIcon = bond.bondIconSvg
  let loading = !bond.bondPrice

  return (
    <div className="px-10 mr-10 text-white grid grid-cols-4 space-x-16 md:text-md 2xl:text-sm">
      <div className="py-5 align-middle space-y-2">
        <div className="text-4xl font-bold">Bond (1,1)</div>
        <div className="flex item-stretch">
          <div className="text-xl font-semibold text-white uppercase">
            {bondNamePretty}
          </div>
          <BondIcon className="w-8 h-8" />
        </div>
      </div>
      <div className="inline-flex flex-wrap items-center px-3 py-2 rounded-lg bg-bg-scheme-500 bg-opacity-50 col-span-3 gap-x-20 gap-y-5">
        <div className="grid grid-rows-2">
          <div className="text-gray-500 row-start-1 text-md">Bonded Value</div>
          <div className="text-lg row-start-2">
            <>
              {loading ? (
                <Skeleton height={40} width={100} />
              ) : (
                "$" + prettify(bond.purchased)
              )}
            </>
          </div>
        </div>
        <div className="grid grid-rows-2">
          <div className="text-gray-500 row-start-1 text-md">
            ART Market Price
          </div>
          <div className="text-lg text-white row-start-2">
            <>
              {loading ? (
                <Skeleton height={40} width={100} />
              ) : (
                "$" + prettify(marketPrice)
              )}
            </>
          </div>
        </div>
        <div className="grid grid-rows-2">
          <div className="text-gray-500 row-start-1 text-md">Bond Price</div>
          <div className="text-lg text-white row-start-2">
            <>
              {loading ? (
                <Skeleton height={40} width={100} />
              ) : (
                "$" + prettify(marketPrice)
              )}
            </>
          </div>
        </div>
      </div>
    </div>
  )
}

function BondPair() {
  // for the switch, we cannot really use another datatype other than boolean
  const [mode, setMode] = useState(false)
  const set = () => {
    setMode(!mode)
  }

  const isBonding = !mode
  const isRedeeming = mode

  const [slippage, setSlippage] = useState(0.5)

  let bonds = useBonds()
  let router = useRouter()
  const bond = useMemo(
    () => bonds.find(({ name }) => name === router.query.pair?.toString()),
    [bonds, router.query]
  )
  if (!bond.name) return null

  return (
    <Layout>
      <div
        className="container relative h-full min-h-screen bg-black"
        data-cy="bond-page"
      >
        <div className="px-8 py-8 pt-6 bg-black grid grid-cols-12">
          <div className="hidden md:grid col-start-11 col-span-2">
            <ConnectButton />
          </div>
        </div>
        <Header />
        <div className="px-10 mx-10 mt-10 mb-5 mr-20 py-7 rounded-md bg-bg-scheme-500 bg-opacity-50">
          <Link href="/bond">
            <a className="items-center hidden px-10 text-gray-500 sm:inline-flex left-1 sm:absolute gap-2 group">
              <ArrowLeftIcon className="h-10 px-20 w-6.5 group-hover:-translate-x-1 transition transform" />
            </a>
          </Link>

          <div className="flex justify-center">
            <div className="inline-flex items-center px-1 py-1 text-white border-2 gap-2 border-dark-1000 rounded-md">
              <button
                onClick={set}
                className={clsx(
                  "px-5 py-1.5 tracking-2% transition-colors font-medium",
                  {
                    "bg-dark-1000 rounded-md font-semibold": !mode,
                  }
                )}
              >
                Bond
              </button>
              <button
                onClick={set}
                className={clsx(
                  "px-3 py-1 tracking-2% transition-colors font-medium",
                  {
                    "bg-dark-1000 rounded-md font-semibold": mode,
                  }
                )}
              >
                Redeem
              </button>
            </div>
          </div>

          <div className="mt-8">
            {isBonding && (
              <div>
                <Bonding
                  bond={bond}
                  slippage={slippage}
                  setSlippage={setSlippage}
                />
              </div>
            )}
            {isRedeeming && (
              <div>
                <Redeem bond={bond} />
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default BondPair
