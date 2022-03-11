import Image from "next/image"
import Link from "next/link"

import ConnectButton from "@components/ConnectButton"
import CheckIcon from "@components/customicons/CheckIcon"
import Layout from "@components/layouts/Layout"
import PageHeading, { CheckLabel, Label, Stat } from "@components/ui/Display"
import { fakeNFTListing as fakeNFTList } from "./fakeNFTListing"
import { fNFTOfferingType } from "./fNFTOfferingType"

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
        <div className="rounded-3xl bg-scheme-200">
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
          <div className="relative h-72 w-72">
            <Image src={image} layout="fill" alt={title} />
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
          <div className="flex p-6 pt-4">
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

      <div className="relative h-full min-h-screen py-6 pb-52 p-5">
        <PageHeading>
          <div className="flex-grow py-10 mt-[50px] text-center lg:text-left">
            <PageHeading.Title>Initial fNFT Offerings</PageHeading.Title>
            <PageHeading.Subtitle>
              Get Fractionalized NFT IDOs at a discount
            </PageHeading.Subtitle>
          </div>
        </PageHeading>
        <div className="flex flex-row flex-wrap gap-12 justify-center lg:justify-start">
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
