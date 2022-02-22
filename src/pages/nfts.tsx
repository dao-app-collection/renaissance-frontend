import React from "react"

import { Web3Provider } from "@ethersproject/providers"
import { useWeb3React } from "@web3-react/core"
import Image from "next/image"

import ConnectButton from "@components/ConnectButton"
import CheckIcon from "@components/customicons/CheckIcon"
import FraxIcon from "@components/customicons/FraxIcon"
import Layout from "@components/layouts/Layout"
import Button, { AuctionButton } from "@components/ui/Buttons"
import PageHeading from "@components/ui/PageHeading"

import Punk1 from "../../public/images/Punk-1.png"

const Label = ({
  children,
  classNames = "",
}: {
  children: React.ReactNode
  classNames?: string
}) => <div className={`font-bold text-dark-200 ${classNames}`}>{children}</div>

export const NFTPreview = ({ styles = "" }: { styles?: string }) => {
  return (
    <Image
      src={Punk1}
      layout="responsive"
      alt="NFT preview"
      className={styles}
    />
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
          <div className="text-xl font-bold text-white">{totalSupply}</div>
        </div>
        <div>
          <Label>Collectable Supply</Label>
          <div className="text-xl font-bold text-white">
            {collectableSupply}
          </div>
        </div>
        <div>
          <Label>Market Cap</Label>
          <div className="text-xl font-bold text-white">{marketCap}</div>
        </div>
        <div>
          <Label>Curator Fee</Label>
          <div className="text-xl font-bold text-white">{curatorFee}</div>
        </div>
        <div>
          <Label>Unique Owners</Label>
          <div className="text-xl font-bold text-white">{uniqueOwners}</div>
        </div>
      </div>
    </div>
  )
}

const AuctionTab = () => {
  return (
    <>
      <div className="mb-2 text-2xl font-bold text-white">Current Bid</div>
      <div className="w-full grid auto-cols-max gap-6">
        <div className="col-span-5">
          <div className="text-5xl font-bold text-white">5.42 M FRAX</div>
          <div className="h-4" />
          <div className="flex w-full space-x-4">
            <div className="basis-1/2">
              <AuctionButton type="accept" onClick={() => undefined} />
              <div className="px-1 mt-2 text-white">34% Accepted</div>
            </div>
            <div className="basis-1/2">
              <AuctionButton type="reject" onClick={() => undefined} />
              <div className="px-1 mt-2 text-white">14% Rejected</div>
            </div>
          </div>
        </div>
        <div className="flex col-span-auto space-x-4">
          <div>
            <div className="text-2xl font-bold text-white">Ends In</div>
            <div className="text-xl text-white">7:24:22m</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-white">Quorum</div>
            <div className="text-xl text-white">98%</div>
          </div>
        </div>
      </div>
      <div className="w-full my-6 mt-5 bg-dark-500 h-[4px]" />
      <div className="mb-2 text-2xl font-bold text-white">Place Bid</div>
      <div className="flex items-center justify-between w-full px-8 py-4 my-6 bg-transparent border-2 border-dark-500 rounded-xl bg-scheme-150">
        <input
          className={`w-full text-xl text-left bg-transparent outline-none text-[#797979] text-dark-input tracking-2% `}
          size={12}
          placeholder="0.0"
        />
        <div className="flex items-center justify-center text-xl font-bold text-white w-min space-x-2">
          <FraxIcon />
          <div>FRAX</div>
        </div>
      </div>
      <div className="flex flex-wrap m-4">
        <div className="flex-1">
          <Label classNames="whitespace-nowrap">Minimum Bid</Label>
          <div className="text-3xl font-bold text-white">$510k</div>
        </div>
        <div className="flex-1">
          <Label classNames="whitespace-nowrap">Market Cap</Label>
          <div className="text-3xl font-bold text-white">$300k</div>
        </div>
        <div className="flex-1">
          <Label classNames="whitespace-nowrap">Your Balance</Label>
          <div className="text-3xl font-bold text-white">200 Frax</div>
        </div>
      </div>
      <div className="h-6" />
      <Button className="justify-center w-full">
        Place Bid & Start Auction
      </Button>
    </>
  )
}

const NFTInteractionCard = () => {
  enum Tab {
    Auction,
    Trade,
    Stake,
  }

  const [tab, setTab] = React.useState<Tab>(Tab.Auction)

  const tabs: Record<Tab, JSX.Element> = {
    [Tab.Auction]: <AuctionTab />,
  }

  const currentTab = tabs[tab]

  const TabButton = ({
    children,
    onClick,
    isSelected,
    styleOverrides = "",
  }: {
    children: React.ReactNode
    onClick: VoidFunction
    isSelected: boolean
    styleOverrides?: string
  }) => {
    return (
      <div
        className="relative h-20 text-white cursor-pointer bg-accents-pink basis-1/3"
        onClick={onClick}
      >
        <div className="flex items-center justify-center w-full h-full text-2xl font-bold text-white">
          <div className="z-10">{children}</div>
          <div
            className={`absolute w-full h-20 bottom-0 ${
              isSelected ? "h-[4.6rem] bg-scheme-200" : "bg-scheme-150"
            } ${styleOverrides}`}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-3xl bg-scheme-250 overflow-clip h-min">
      <div className="flex w-full">
        <TabButton
          isSelected={tab === Tab.Auction}
          onClick={() => setTab(Tab.Auction)}
          styleOverrides="rounded-tl-3xl"
        >
          Auction
        </TabButton>
        <TabButton
          isSelected={tab === Tab.Trade}
          onClick={() => setTab(Tab.Trade)}
        >
          Trade
        </TabButton>
        <TabButton
          isSelected={tab === Tab.Stake}
          onClick={() => setTab(Tab.Stake)}
          styleOverrides="rounded-tr-3xl"
        >
          Stake
        </TabButton>
      </div>
      <div className="p-12">{currentTab}</div>
    </div>
  )
}

export default function NFTs() {
  const { account, library } = useWeb3React<Web3Provider>()
  const name = "PUNK #1"
  const subtitle = "@Beeple"
  const symbol = "fNFT PUNK"
  const amount = 1_000_000
  const collectableSupply = "71.2%"
  const marketCap = "$3,422,305"
  const curatorFee = "0.03%"
  const uniqueOwners = "1,502"
  const totalSupply = 20_000_000

  return (
    <Layout>
      <ConnectButton customStyle="z-50 absolute right-[5px] top-[50px] w-[200px] lg:right-[40px]" />
      <div className="container relative h-full min-h-screen py-6">
        <PageHeading>
          <div className="flex-grow py-10 mt-[50px]">
            <PageHeading.Title>{name}</PageHeading.Title>
            <PageHeading.Subtitle>
              <div className="flex items-center">
                {subtitle}
                <div className="w-1" />
                <CheckIcon type="green" />
              </div>
            </PageHeading.Subtitle>
          </div>
        </PageHeading>
        <div className="max-w-8xl grid grid-cols-1 md:grid-cols-2 gap-16">
          <div className="max-w-xl justify-self-center center space-y-4">
            <NFTPreview styles="rounded-3xl" />
            <div>
              <div className="font-bold text-dark-200">My Ownership</div>
              <div className="text-2xl font-bold text-white">
                {amount.toLocaleString()} {symbol}
              </div>
              <div className="mt-4 text-xl font-bold text-white">
                ({(amount / totalSupply) * 100}%)
              </div>
            </div>
            <div className="w-full mt-5 bg-dark-500 h-[4px]" />
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
          <NFTInteractionCard />
        </div>
      </div>
    </Layout>
  )
}
