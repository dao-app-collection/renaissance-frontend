import React from "react"

import { useWeb3React } from "@web3-react/core"
import { useRouter } from "next/router"
import useSWR from "swr"

import ArtPresaleABI from "@abi/ArtPresale.json"
import Layout from "@components/layouts/Layout"
import PageHeading from "@components/ui/PageHeading"
import { currentAddresses } from "@constants"
import Presale from "@contracts/Presale"
import { useContract } from "@hooks/contracts/useContract"
import { useToken } from "@hooks/contracts/useToken"
import { useTokenBalance } from "@hooks/contracts/useTokenBalance"

const MAX_ALLOCATION = 1500

interface Fields {
  amount: number
}

export default function Whitelist() {
  const { account } = useWeb3React()

  const aArt = useToken(currentAddresses.AART_ADDRESS, {
    decimals: 9,
  })

  const presale = useContract(
    Presale,
    currentAddresses.DAI_ART_PRESALE_ADDRESS,
    ArtPresaleABI
  )

  const aArtBalance = useTokenBalance(aArt)

  const { data: user } = useSWR(["/user", account], (_, account) =>
    presale.userInfo(account)
  )

  const router = useRouter()

  return (
    <Layout>
      <div className="container relative min-h-screen py-10">
        <PageHeading>
          <div className="flex-grow">
            <PageHeading.Title>Whitelist</PageHeading.Title>
          </div>

          <PageHeading.Content>
            <PageHeading.Stat
              title="aART BALANCE"
              subtitle={aArtBalance.balance ?? 0}
            />
            <PageHeading.Stat
              title="DAI DEPOSITED"
              subtitle={user?.amount ?? 0}
            />
          </PageHeading.Content>
        </PageHeading>

        <section className="mt-14 space-y-6 xl:space-y-8">
          <h2 className="text-lg font-bold text-center 2xl:text-xl tracking-2% text-dark-700">
            Whitelist distribution has ended
          </h2>
          <p className="max-w-lg mx-auto font-medium sm:text-sm sm:px-0 2xl:leading-relaxed xl:px-4 2xl:px-6 2xl:text-[17px] text-dark-700 xl:max-w-xl 2xl:max-w-2xl tracking-2%">
            aART will trade on{" "}
            <a
              className="font-medium text-orange-600 tracking-2%"
              target="_blank"
              href=""
              rel="noopener nofollow noreferrer"
            >
              Trisolaris
            </a>{" "}
            until full launch at which time ART can be redeemed 1:1 for aART.
            Expect launch before the end of this month.{" "}
          </p>
        </section>
      </div>
    </Layout>
  )
}
