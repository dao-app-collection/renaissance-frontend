import React from "react"

import Image from "next/image"

import FraxIcon from "@components/customicons/FraxIcon"
import SwapIcon from "@components/customicons/SwapIcon"
import Button, { AuctionButton } from "@components/ui/Buttons"
import { fNFTOfferingType } from "@pages/nfts"

import Punk1 from "../../../public/images/Punk-1.png"
import RenaissanceLogo from "../../../public/images/renaissance-logo.svg"
import { Divide, Label, Stat, WithTailwind } from "./Display"

enum Tab {
  Auction,
  Trade,
  Stake,
  InitialOffering,
}

const InputLabel = ({
  children,
  className,
}: { children: React.ReactNode } & WithTailwind) => (
  <div className={`mb-2 text-2xl font-bold text-white ${className}`}>
    {children}
  </div>
)

const CurrencyInput = ({
  symbol,
  icon,
  withMax,
  className,
}: {
  symbol: string
  icon?: React.ReactNode
  withMax?: boolean
} & WithTailwind) => {
  return (
    <div
      className={`${className} flex items-center justify-between w-full px-8 py-4 my-6 bg-transparent border-2 border-dark-500 rounded-xl bg-scheme-150`}
    >
      <input
        className={`w-full font-bold text-2xl text-left bg-transparent outline-none text-[#797979] text-dark-input tracking-2% `}
        size={12}
        placeholder="0.0"
      />
      <div className="flex items-center justify-center text-xl font-bold text-white w-min space-x-2">
        {icon}
        <div className="whitespace-nowrap">{symbol}</div>
        {/* {withMax && (
          <>
            <div className="w-2" />
            <button className="px-2 text-sm font-medium text-gray-300 border border-gray-300 bg-scheme-300 hover:bg-scheme-200 rounded-md whitespace-nowrap">
              max
            </button>
          </>
        )} */}
      </div>
    </div>
  )
}

const InitialOfferingTab = () => {
  return (
    <>
      <InputLabel>Mint</InputLabel>
      <CurrencyInput symbol="FRAX" icon={<FraxIcon />} />
      <div className="flex flex-wrap gap-4">
        <div className="grow">
          <Label>Offer Price </Label>
          <Stat className="text-3xl">$1.50</Stat>
        </div>
        <div className="grow">
          <Label classNames="whitespace-nowrap">Offered Supply</Label>
          <Stat className="text-3xl">1M</Stat>
        </div>
        <div className="grow">
          <Label classNames="whitespace-nowrap">Max Allocation</Label>
          <Stat className="text-3xl">2000 Frax</Stat>
        </div>
        <div className="grow">
          <Label classNames="whitespace-nowrap">Sale Ends in</Label>
          <Stat className="text-3xl">5D 12H 10M</Stat>
        </div>
      </div>
      <div className="h-8" />
      <Label>Sold</Label>
      <Stat>600,000 (60%)</Stat>
      <div className="h-8" />
      <Button className="w-full font-bold">Deposit and Mint</Button>
    </>
  )
}
const StakeTab = () => {
  return (
    <>
      <div className="flex justify-between h-min">
        <button>
          <InputLabel className="mb-0">Stake fNFT</InputLabel>
        </button>
        <button>
          <InputLabel className="mb-0 text-gray-500">Unstake</InputLabel>
        </button>
      </div>
      <CurrencyInput
        symbol="fPUNK-1"
        icon={
          <div className="w-8 h-8 rounded-full overflow-clip">
            <Image src={Punk1} layout="responsive" alt="punk-1" />
          </div>
        }
      />
      <Label>
        Your Stakable fNFT Balance <span className="text-sm">(Max)</span>
      </Label>
      <Stat>1,000 fPUNK-1</Stat>
      <div className="my-4">
        <Divide />
      </div>
      <InputLabel>Stake ART</InputLabel>

      <CurrencyInput
        className="py-4"
        symbol="ART"
        icon={
          <div className="w-8 h-8 rounded-full overflow-clip">
            <Image src={RenaissanceLogo} alt="art logo" layout="responsive" />
          </div>
        }
      />
      <Label>
        Your Stakable ART Balance <span className="text-sm">(Max)</span>
      </Label>
      <Stat>215 ART</Stat>
      <div className="h-4" />
      <div className="flex flex-wrap ">
        <div className="mt-2 grow">
          <Label classNames="whitespace-nowrap">Rebase Rate</Label>
          <Stat className="text-3xl">0.34%</Stat>
        </div>
        <div className="mt-2 grow">
          <Label classNames="whitespace-nowrap">Next Rebase</Label>
          <Stat className="text-3xl">8h 34m</Stat>
        </div>
        <div className="mt-2 grow">
          <Label classNames="whitespace-nowrap">Next Reward</Label>
          <Stat className="text-3xl">0.2 ART</Stat>
        </div>
        <div className="mt-2 grow">
          <Label classNames="whitespace-nowrap">Required ART Ratio</Label>
          <Stat className="text-3xl">10% (1 sART / 10 fNFT)</Stat>
        </div>
      </div>
      <div className="h-8" />
      <Button className="w-full font-bold">Stake</Button>
    </>
  )
}

const TradeTab = () => {
  return (
    <>
      <InputLabel>Input</InputLabel>
      <CurrencyInput symbol="FRAX" icon={<FraxIcon />} withMax />
      <div className="h-2" />
      <div className="relative flex justify-center w-full cursor-pointer">
        <SwapIcon className="z-10" />
        <Divide className="absolute top-0" />
      </div>
      <div className="h-2" />
      <InputLabel>Output</InputLabel>
      <CurrencyInput
        symbol="fPUNK-1"
        icon={
          <div className="w-8 h-8 rounded-full overflow-clip">
            <Image src={Punk1} layout="responsive" alt="punk-1" />
          </div>
        }
      />
      <div className="h-4" />
      <Label>Your Balance (Max)</Label>
      <Stat className="text-2xl">1,000,000 FRAX</Stat>
      <div className="h-6" />
      <div className="flex flex-wrap ">
        <div className="grow">
          <Label classNames="whitespace-nowrap">Min Received</Label>
          <Stat className="text-xl">2,500 fPUNK-1</Stat>
        </div>
        <div className="grow">
          <Label classNames="whitespace-nowrap">Price Impact</Label>
          <Stat className="text-xl text-accents-red">6.2%</Stat>
        </div>
        <div className="grow">
          <Label classNames="whitespace-nowrap">Slippage</Label>
          <Stat className="text-xl">0.2%</Stat>
        </div>
      </div>
      <div className="h-8" />
      <Button className="w-full font-bold">Swap</Button>
    </>
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
      <Divide />
      <InputLabel>Place Bid</InputLabel>
      <CurrencyInput symbol="FRAX" icon={<FraxIcon />} />

      <div className="flex flex-wrap m-4">
        <div className="flex-1">
          <Label classNames="whitespace-nowrap">Minimum Bid</Label>
          <Stat className="text-3xl">$510k</Stat>
        </div>
        <div className="flex-1">
          <Label classNames="whitespace-nowrap">Market Cap</Label>
          <Stat className="text-3xl">$300k</Stat>
        </div>
        <div className="flex-1">
          <Label classNames="whitespace-nowrap">Your Balance</Label>
          <Stat className="text-3xl">200 Frax</Stat>
        </div>
      </div>
      <div className="h-6" />
      <Button className="justify-center w-full">
        Place Bid & Start Auction
      </Button>
    </>
  )
}

const NFTInteractionCard = ({ type }: { type: fNFTOfferingType }) => {
  const [_tab, setTab] = React.useState<Tab>(Tab.Auction)
  const tab =
    type === fNFTOfferingType.InitialOffering ? Tab.InitialOffering : _tab
  const tabs: Record<Tab, JSX.Element> = {
    [Tab.Auction]: <AuctionTab />,
    [Tab.Trade]: <TradeTab />,
    [Tab.Stake]: <StakeTab />,
    [Tab.InitialOffering]: <InitialOfferingTab />,
  }

  const TabButton = ({
    children,
    onClick,
    isSelected,
    styleOverrides = "",
    fullWidth = false,
  }: {
    children: React.ReactNode
    onClick: VoidFunction
    isSelected: boolean
    fullWidth?: boolean
    styleOverrides?: string
  }) => {
    return (
      <button
        onClick={onClick}
        className={`relative h-20 text-white cursor-pointer bg-accents-pink ${
          fullWidth ? "grow" : "basis-1/3"
        }`}
      >
        <div
          className={`flex items-center w-full h-full text-lg font-bold text-white md:text-2xl`}
        >
          <div
            className={`z-10 w-full ${
              fullWidth ? "text-left px-12" : "text-center"
            }`}
          >
            {children}
          </div>
          <div
            className={`absolute w-full h-20 bottom-0 ${
              isSelected ? "h-[4.6rem] bg-scheme-200" : "bg-scheme-150"
            } ${styleOverrides}`}
          />
        </div>
      </button>
    )
  }

  return (
    <div className="max-w-2xl rounded-3xl bg-scheme-250 overflow-clip h-min">
      <div className="flex w-full">
        {type === fNFTOfferingType.PublicSale ? (
          <>
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
          </>
        ) : (
          <TabButton
            styleOverrides="rounded-t-3xl"
            onClick={() => undefined}
            fullWidth
            isSelected={true}
          >
            <div className="flex items-center gap-2">
              Initial Offering
              <div className={`h-3 w-3 rounded-full bg-accents-orange`} />
            </div>
          </TabButton>
        )}
      </div>
      <div className="px-6 py-4 md:p-12">{tabs[tab]}</div>
    </div>
  )
}
export default NFTInteractionCard
