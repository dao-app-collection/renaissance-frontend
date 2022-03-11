import React from "react"

import { Web3Provider } from "@ethersproject/providers"
import { useWeb3React } from "@web3-react/core"
import Image from "next/image"
import { useRouter } from "next/router"

import ConnectButton from "@components/ConnectButton"
import CheckIcon from "@components/customicons/CheckIcon"
import EtherscanIcon from "@components/customicons/EtherscanIcon"
import OpenseaIcon from "@components/customicons/OpenseaIcon"
import Layout from "@components/layouts/Layout"
import PageHeading, { Divide, Label, Stat } from "@components/ui/Display"
import NFTInteractionCard from "@components/ui/NFTInteractionCard"
import { fakeNFTListing as fakeNFTList } from "@utils/fakeNFTListing"

const InfoBanner = ({
  children,
  icon,
}: {
  icon: React.ReactNode
  children: React.ReactNode
}) => {
  return (
    <div className="max-w-2xl px-8 py-8 rounded-3xl bg-scheme-250">
      <div className="flex flex-row items-center ">
        <div className="w-10 h-10 mr-8">{icon}</div>
        <div>{children}</div>
      </div>
    </div>
  )
}

const NFTStats = ({
  totalSupply,
  collectableSupply,
  marketCap,
  curatorFee,
  uniqueOwners,
}: {
  totalSupply: string
  collectableSupply: string
  marketCap: string
  curatorFee: string
  uniqueOwners: string
}) => {
  return (
    <div className="space-y-4">
      <Label>Description</Label>
      <div className="text-lg font-normal text-white">
        The CryptoPunks are a collection of 24x24, 8-bit-style pixel art images
        of misfits and eccentrics.
      </div>
      <div className="grid grid-cols-2 gap-y-6">
        <div>
          <Label>Total Supply</Label>
          <Stat>{totalSupply}</Stat>
        </div>
        <div>
          <Label>Collectable Supply</Label>
          <Stat>{collectableSupply}</Stat>
        </div>
        <div>
          <Label>Market Cap</Label>
          <Stat>{marketCap}</Stat>
        </div>
        <div>
          <Label>Curator Fee</Label>
          <Stat>{curatorFee}</Stat>
        </div>
        <div>
          <Label>Unique Owners</Label>
          <Stat>{uniqueOwners}</Stat>
        </div>
      </div>
    </div>
  )
}

export default function NFTs() {
  const { account, library } = useWeb3React<Web3Provider>()
  const router = useRouter()
  const name = "PUNK #1"
  const subtitle = "@LarvaLabs"
  const symbol = "fNFT PUNK"
  const amount = 1_000_000
  const collectableSupply = "71.2%"
  const marketCap = "$3,422,305"
  const curatorFee = "0.03%"
  const uniqueOwners = "1,502"
  const totalSupply = 20_000_000

  // these a funged for demo purposes
  const { nftAddress, tokenId } = router.query
  const item = fakeNFTList.find((nft) =>
    nft.title.replace(new RegExp(" ", "g"), "").includes(nftAddress as string)
  )

  return (
    <Layout>
      <ConnectButton customStyle="z-50 absolute right-[5px] top-[50px] w-[200px] lg:right-[40px]" />
      <div className="container relative h-full min-h-screen py-6 pb-52">
        <PageHeading>
          <div className="flex-grow py-10 mt-[50px]">
            <PageHeading.Title>{name}</PageHeading.Title>
            <PageHeading.Subtitle>
              <div className="flex items-center">
                {subtitle}
                <div className="w-1" />
                <CheckIcon color="green" />
              </div>
            </PageHeading.Subtitle>
          </div>
        </PageHeading>
        <div className="max-w-8xl grid grid-cols-1 md:grid-cols-2 gap-16">
          <div className="max-w-xl justify-self-center center space-y-4">
            <div className="rounded-3xl">
              {item ? (
                <Image
                  src={item?.image}
                  layout="responsive"
                  alt={item?.title}
                />
              ) : null}
            </div>
            <div>
              <div className="mt-6 mb-4 text-lg font-bold text-dark-200">
                My Ownership
              </div>
              <div className="text-3xl font-bold text-white">
                {amount.toLocaleString()} {symbol}
              </div>
              <div className="mt-4 text-lg font-bold text-white">
                ({(amount / totalSupply) * 100}%)
              </div>
            </div>
            <Divide />
            <div className="h-1" />
            <NFTStats
              {...{
                collectableSupply,
                curatorFee,
                marketCap,
                totalSupply: totalSupply.toLocaleString(),
                uniqueOwners,
              }}
            />
          </div>
          <div>
            <NFTInteractionCard type={item ? item.type : null} />
            <div className="h-12" />
            <div className="space-y-5">
              <InfoBanner icon={<CheckIcon color="green" size="40" />}>
                <div className="text-2xl tracking-wide text-white">
                  <span className="text-accents-green">Verified</span>{" "}
                  <span>by</span>{" "}
                  <span className="font-bold">Renaissance Labs</span>
                </div>
              </InfoBanner>
              <InfoBanner icon={<EtherscanIcon size="40" />}>
                <div className="text-2xl tracking-wide text-white">
                  <span>View NFT on</span>{" "}
                  <span
                    className="font-bold cursor-pointer"
                    onClick={() =>
                      window.open("https://etherscan.io/", "_blank")
                    }
                  >
                    Etherscan
                  </span>
                </div>
              </InfoBanner>
              <InfoBanner icon={<OpenseaIcon size="40" />}>
                <div className="text-2xl tracking-wide text-white">
                  <span>View NFT on</span>{" "}
                  <span
                    className="font-bold cursor-pointer"
                    onClick={() => window.open("https://opensea.io/", "_blank")}
                  >
                    Opensea
                  </span>
                </div>
              </InfoBanner>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
