import { useEffect, useState } from "react"

import { ArrowLeftIcon } from "@heroicons/react/outline"
import clsx from "clsx"
import Link from "next/link"
import { useRouter } from "next/router"
import { useSelector } from "react-redux"

import BondPurchase from "@components/bonds/BondPurchase"
import BondRedeem from "@components/bonds/BondRedeem"
import Layout from "@components/layouts/Layout"
import ArtSwitch from "@components/ui/ArtSwitch"
import PageHeading from "@components/ui/PageHeading"
import Skeleton from "@components/ui/Skeleton"
import { prettify } from "@helper"
import { allBondsMap } from "@helper/bonds/allBonds"
import useBonds from "@hooks/bondData"

function BondPair() {
  const { bonds } = useBonds()
  const router = useRouter()
  const isBondLoading = useSelector(
    (state: any) => state.bonding.loading ?? true
  )
  // for the switch, we cannot really use another datatype other than boolean
  const [mode, setMode] = useState(false)
  const isBonding = !mode
  const isRedeeming = mode

  const [bond, setBond] = useState<any>({})
  const [slippage, setSlippage] = useState(0.5)

  useEffect(() => {
    if (!router.query.pair) return
    setBond(allBondsMap[router.query.pair.toString()])
  }, [bonds, router])

  if (!bond.name) return null

  return (
    <Layout>
      <div className="container relative min-h-screen py-10 bg-dark-1000">
        <PageHeading>
          <div className="flex-grow">
            <PageHeading.Title>Bond</PageHeading.Title>
          </div>

          <PageHeading.Content>
            <PageHeading.Stat
              title="BONDED VALUE"
              subtitle={
                isBondLoading ? (
                  <Skeleton height={30} width={150} />
                ) : (
                  "$" + prettify(bond.purchased)
                )
              }
            />
            <PageHeading.Stat
              title="BOND PRICE"
              subtitle={
                isBondLoading ? (
                  <Skeleton height={30} width={150} />
                ) : (
                  "$" + prettify(bond.bondPrice)
                )
              }
            />
          </PageHeading.Content>
        </PageHeading>

        <div className="py-16">
          <Link href="/bond">
            <a className="items-center hidden text-sm font-medium text-orange-600 sm:inline-flex left-12 sm:absolute gap-2 group">
              <ArrowLeftIcon className="w-4 h-4 group-hover:-translate-x-1 transition transform" />
              <span>Back</span>
            </a>
          </Link>

          <div className="flex justify-center">
            <div className="inline-flex items-center gap-4">
              <span
                className={clsx(
                  "tracking-2% transition-colors font-medium text-dark-300",
                  {
                    "font-semibold !text-orange-600": !mode,
                  }
                )}
              >
                Bond
              </span>
              <ArtSwitch enabled={mode} onChange={setMode} />
              <span
                className={clsx(
                  "tracking-2% transition-colors font-medium text-dark-300",
                  {
                    "font-semibold !text-orange-600": mode,
                  }
                )}
              >
                Redeem
              </span>
            </div>
          </div>

          <div className="mt-8">
            {isBonding && (
              <BondPurchase
                bond={bond}
                slippage={slippage}
                setSlippage={setSlippage}
              />
            )}
            {isRedeeming && <BondRedeem bond={bond} />}
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default BondPair
