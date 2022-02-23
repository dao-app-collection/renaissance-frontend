import Image from "next/image"
import Link from "next/link"

import ConnectButton from "@components/ConnectButton"
import CheckIcon from "@components/customicons/CheckIcon"
import Layout from "@components/layouts/Layout"
import PageHeading, { CheckLabel, Label, Stat } from "@components/ui/Display"

import BoredApe11 from "../../../public/images/bayc-11.png"
import Doodles102 from "../../../public/images/doodles-102.png"
import Punk1 from "../../../public/images/Punk-1.png"
import Sculpture12 from "../../../public/images/sculpture-12.png"

export enum fNFTOfferingType {
  PublicSale,
  InitialOffering,
}

export const fakeNFTList = [
  {
    image: <Image src={Doodles102} layout="responsive" alt="NFT preview" />,
    author: "poopie",
    title: "Doodles #102",
    type: fNFTOfferingType.PublicSale,
    verified: true,
    stats: [
      { label: "Price", value: "$1.24" },
      { label: "Market Cap", value: "$100k" },
      { label: "Bid", value: "100k" },
    ],
  },
  {
    image: <Image src={Sculpture12} layout="responsive" alt="NFT preview" />,
    author: "Renaissance",
    title: "Sculpture #12",
    type: fNFTOfferingType.InitialOffering,
    verified: true,
    stats: [
      { label: "Price", value: "$2" },
      { label: "Ends In", value: "1d 2h 34m" },
      { label: "Sold", value: "70%" },
    ],
  },
  {
    image: <Image src={Punk1} layout="responsive" alt="NFT preview" />,
    author: "LarvaLabs",
    title: "Punk #1",
    type: fNFTOfferingType.PublicSale,
    verified: true,
    stats: [
      { label: "Price", value: "$2" },
      { label: "Market Cap", value: "$1.2m" },
      { label: "Bid", value: "$110k" },
    ],
  },
  {
    image: <Image src={BoredApe11} layout="responsive" alt="NFT preview" />,
    author: "BAYC",
    title: "Bored Ape #11",
    type: fNFTOfferingType.PublicSale,
    verified: true,
    stats: [
      { label: "Price", value: "$1.24" },
      { label: "Market Cap", value: "$300k" },
      { label: "Bid", value: "$510k" },
    ],
  },
]

const NFTCard = ({
  author,
  image,
  stats,
  title,
  type,
  verified,
}: typeof fakeNFTList[number]) => {
  const styles = {
    [fNFTOfferingType.PublicSale]: {
      iconColor: "bg-accents-green",
      text: "Public Sale",
      dropShadowColor: "shadow-accents-green/20",
    },
    [fNFTOfferingType.InitialOffering]: {
      iconColor: "bg-accents-orange",
      text: "Initial Offering",
      dropShadowColor: "shadow-accents-orange/30",
    },
  }
  const style = styles[type]
  return (
    <Link
      href={`/nfts/${title
        .replace(new RegExp(" ", "g"), "")
        .split("#")
        .join("/")}`}
      passHref
    >
      <a href="">
        <div className="w-80 min-w-80 rounded-3xl bg-scheme-200">
          <div className="p-4">
            {verified && (
              <CheckLabel
                className="h-10 px-4 text-sm font-bold capitalize border w-min"
                size={20}
              >
                Verified
              </CheckLabel>
            )}
          </div>
          <div className="relative w-full">
            {image}
            <div
              className={`absolute flex flex-row items-center justify-center px-4 py-2 rounded-lg shadow-banner text-md bottom-4 left-4 bg-scheme-300 space-x-2 ${style.dropShadowColor}`}
            >
              <div className={`h-3 w-3 rounded-full ${style.iconColor}`} />
              <div className="text-sm font-bold text-white uppercase">
                {style.text}
              </div>
            </div>
          </div>
          <div className="z-10 px-6 py-4 shadow-[0px_4px_4px_rgba(0,0,0,0.25)] bg-scheme-200">
            <div className="flex items-center text-sm text-white space-x-1">
              <div>@{author}</div>
              {verified && <CheckIcon color="green" size="8" />}
            </div>
            <div className="text-3xl font-bold text-white">{title}</div>
          </div>
          <div className="flex p-6 pt-4 ">
            {stats.map(({ label, value }, i) => {
              return (
                <div key={i} className="grow">
                  <Label classNames="whitespace-nowrap">{label}</Label>
                  <Stat className="text-2xl">{value}</Stat>
                </div>
              )
            })}
          </div>
        </div>
      </a>
    </Link>
  )
}

const NFTMarketplace = () => {
  return (
    <Layout>
      <ConnectButton customStyle="z-50 absolute right-[5px] top-[50px] w-[200px] lg:right-[40px]" />

      <div className="relative h-full min-h-screen py-6 pb-52">
        <PageHeading>
          <div className="flex-grow py-10 mt-[50px]">
            <PageHeading.Title>Initial fNFT Offerings</PageHeading.Title>
            <PageHeading.Subtitle>
              Get Fractionalized NFT IDOs at a discount
            </PageHeading.Subtitle>
          </div>
        </PageHeading>
        <div className="flex flex-row flex-wrap gap-12">
          {[...fakeNFTList].map((item, i) => (
            <div key={i} className="flex-none">
              <NFTCard {...item} />
            </div>
          ))}
        </div>
      </div>
    </Layout>
  )
}

export default NFTMarketplace
