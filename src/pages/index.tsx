import React, { useEffect, useRef, useState } from "react"

import Image from "next/image"
import Link from "next/link"
import { useSelector } from "react-redux"
import VanillaTilt from "vanilla-tilt"

import Skeleton from "@components/ui/Skeleton"
import { prettify } from "@helper"
import { allBondsMap } from "@helper/bonds/allBonds"

import BustImage from "../../public/images/bust.png"
import Shadows from "../../public/images/shadows.png"

function NFTCard({
  borderColor,
  ...props
}: {
  borderColor: string
} & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      style={{
        borderRadius: "32px",
        border: `4px solid ${borderColor}`,
        width: "250px",
        height: "320px",
        background: "#030303",
        pointerEvents: "none",
        ...props.style,
      }}
    >
      <div
        style={{
          transform: "translate3d(20px, -100px, 10px)",
          pointerEvents: "none",
        }}
      >
        <Image alt="art" src={BustImage} />
      </div>
    </div>
  )
}

function Nav() {
  const [showMenu, setShowMenu] = useState(false)

  return (
    <nav className="relative py-6">
      <div className="hidden w-full px-4 md:grid grid-cols-3 justify-evenly">
        <Link href="/">
          <div className="items-center text-xl font-semibold text-white cursor-pointer left-4 md:flex justify-self-start col-span-1">
            <Image
              src={"/images/renaissance-logo.svg"}
              alt="logo"
              width={"48px"}
              height={"48px"}
              className="absolute"
            />
            <div className="w-4" />
            Renaissance
          </div>
        </Link>
        <div className="items-center hidden text-lg md:flex flex-nowrap justify-self-center col-span-1">
          <a
            href="#"
            className="px-8 font-semibold text-white cursor-pointer transition duration-300 hover:text-green-500"
          >
            Marketplace
          </a>
          <a
            href="#"
            className="px-8 font-semibold text-white cursor-pointer transition duration-300 hover:text-green-500"
          >
            Bond
          </a>
          <a
            href="#"
            className="px-8 font-semibold text-white cursor-pointer transition duration-300 hover:text-green-500"
          >
            Stake
          </a>
          <a
            href="#"
            className="px-8 font-semibold text-white cursor-pointer transition duration-300 hover:text-green-500"
          >
            {" "}
            FAQ
          </a>
        </div>
      </div>

      {/* mobile nav */}
      <div className={`relative flex w-full px-4 md:hidden  mb-6`}>
        <button
          className=" outline-none mobile-menu-button"
          onClick={() => setShowMenu((show) => !show)}
        >
          <svg
            className="w-6 h-6 text-gray-500 hover:text-green-500"
            x-show="!showMenu"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="3"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M4 6h16M4 12h16M4 18h16"></path>
          </svg>
        </button>
      </div>
      <div
        className={`${
          showMenu ? "h-auto" : "h-0 overflow-hidden"
        } absolute w-full transition-[height] mobile-menu`}
      >
        <ul className="bg-bg-scheme-400">
          <li className="active">
            <a
              href="#"
              className="block px-2 py-4 text-sm font-semibold text-white hover:bg-green-500"
            >
              Home
            </a>
          </li>
          <li>
            <a
              href="#services"
              className="block px-2 py-4 text-sm transition duration-300 hover:bg-green-500"
            >
              Marketplace
            </a>
          </li>
          <li>
            <a
              href="#about"
              className="block px-2 py-4 text-sm transition duration-300 hover:bg-green-500"
            >
              Bond
            </a>
          </li>
          <li>
            <a
              href="#contact"
              className="block px-2 py-4 text-sm transition duration-300 hover:bg-green-500"
            >
              Stake
            </a>
          </li>
          <li>
            <a
              href="#contact"
              className="block px-2 py-4 text-sm transition duration-300 hover:bg-green-500"
            >
              FAQ
            </a>
          </li>
        </ul>
      </div>
    </nav>
  )
}

function SlashScreen() {
  const secondCardRef = useRef(null)

  useEffect(() => {
    VanillaTilt.init([secondCardRef.current], {
      startX: 25,
      startY: 10,
      perspective: 1000,
      transition: true,
      easing: "cubic-bezier(.03,.98,.52,.99)",
      max: 15,
      gyroscope: true,
    })
  }, [])

  return (
    <div className="relative md:h-[80vh]">
      <div
        className={"absolute h-full md:h-[80vh] w-[100vw] overflow-clip z-[-1]"}
      >
        <Image
          alt="background"
          src="/images/landing-background.png"
          layout="fill"
          objectFit="cover"
          quality={100}
        />
      </div>
      <Nav />
      <div className="h-full mt-8 align-middle grid grid-cols-1 md:grid-cols-2 gap-8 justify-items-center md:mt-0">
        <div className="flex items-center select-none">
          <div className="pointer-events-none z-[-1]">
            <div
              ref={secondCardRef}
              data-tilt
              data-tilt-full-page-listening
              data-shine="true"
              style={{
                transformStyle: "preserve-3d",
                position: "relative",
              }}
            >
              <div
                className="absolute max-w-full opacity-70"
                style={{
                  transform: "scale3d(4, 2, 1) translateZ(-60px)",
                }}
              >
                <Image alt="art" src={Shadows} />
              </div>
              <div
                data-tilt
                data-tilt-max="10"
                data-tilt-reverse
                data-tilt-scale="1.07"
                data-tilt-axis="x"
                data-tilt-speed="1200"
                style={{
                  transform: "translateZ(50px) scale(1.1,1.1)",
                  position: "absolute",
                }}
              >
                <NFTCard borderColor="#B538A6" />
              </div>
              <div
                style={{
                  transform: "translate3d(-20px, -32px, -100px)",
                }}
              >
                <NFTCard
                  borderColor="#6182DC"
                  style={{
                    transform:
                      "rotate(-15deg) scale(1.2,1.2) translate3d(0px,20px,0)",
                    opacity: ".7",
                  }}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="z-10 flex flex-col justify-center px-4 mt-[-2rem] md:mt-0 md:max-w-min">
          <div className="text-5xl font-semibold text-white md:whitespace-nowrap">
            The Rebirth of NFTs
          </div>
          <div className="h-8" />
          <div className="text-xl font-semibold text-white">
            Renaissance is a community-owned financial tool for the better
            future of NFTs. We believe in decentralization of art.
          </div>
          <div className="flex justify-center pt-4 pb-8 md:justify-start ">
            <Link href="/whitelist">
              <button className="px-3 py-2 font-bold text-white bg-blue-600 rounded-md text-md">
                Enter App
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export function TreasuryStats() {
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
    <div className="justify-center text-sm font-medium text-center bg-black grid md:grid-cols-3 rounded-md py-7 text-dark-100">
      <div className="py-4 md:px-20">
        Treasury Balance
        <div className="flex justify-center mt-1 text-3xl font-bold text-center text-white">
          {
            <>
              {isBondLoading ? (
                <Skeleton height={35} width={200} />
              ) : (
                "$" + prettify(treasuryBalance)
              )}
            </>
          }
        </div>
      </div>
      <div className="py-4 md:px-20">
        ART Price
        <div className="flex justify-center mt-1 text-3xl font-bold text-white">
          {
            <>
              {isBondLoading ? (
                <Skeleton height={35} width={120} />
              ) : (
                "$" + prettify(marketPrice)
              )}
            </>
          }
        </div>
      </div>
      <div className="py-4 md:px-20">
        NFT Pre-sale Price
        <div className="flex justify-center mt-1 text-3xl font-bold text-white">
          {
            <>
              {isBondLoading ? (
                <Skeleton height={35} width={100} />
              ) : (
                "$" + prettify(20) + " DAI"
              )}
            </>
          }
        </div>
      </div>
    </div>
  )
}

function Partnerships() {
  return (
    <div className="py-6 bg-dark-gray">
      <div className="flex justify-center text-xl text-bg-scheme-400">
        <p>PARTNERSHIPS</p>
      </div>
      <div className="justify-center px-10 py-2 md:justify-between grid md:grid-cols-3">
        <Image
          src="/images/near-logo.svg"
          alt="Near"
          width={250}
          height={100}
        />
        <Image
          src="/images/aurora-logo.svg"
          alt="Aurora"
          width={250}
          height={100}
        />
        <Image
          src="/images/frax-logo.svg"
          alt="Frax"
          width={250}
          height={100}
        />
      </div>
    </div>
  )
}

function CTACards() {
  return (
    <div className="px-8 py-16 text-white grid md:grid-cols-2 gap-4">
      <div className="px-4 py-4 text-2xl font-medium border border-gray-600 rounded-md">
        Finance
        <div className="text-sm py-7">
          <h5>
            Renaissance is a community-owned financial tool for the better
            future of NFTs. We Believe in decentralization of art.
          </h5>
        </div>
        <div className="flex items-stretch space-x-6">
          <div className="items-center px-4 py-2 mt-2 text-xs font-bold text-center text-black bg-green-500 rounded-md">
            <button>Bond Now</button>
          </div>
        </div>
      </div>
      <div className="px-4 py-4 text-2xl font-medium border border-gray-600 rounded-md">
        NFT
        <div className="text-sm py-7">
          <h5>
            Reserve currency protocol for community ownership of NFTs. We enable
            exchange of fractionalized NTFs.
          </h5>
        </div>
        <div className="flex items-stretch space-x-3">
          <div className="flex items-center px-3 py-2 mt-2 text-xs font-bold text-center text-black bg-green-500 rounded-md whitespace-nowrap">
            <button>Pre-sale</button>
          </div>
          <div className="px-4 py-2 mt-2 text-xs font-black text-center text-black bg-white rounded-md">
            <button>
              Marketplace
              <span className="text-gray-600"> comming soon</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Home() {
  return (
    <div className="overflow-x-hidden max-w-screen">
      <SlashScreen />
      <TreasuryStats />
      <Partnerships />
      <CTACards />
    </div>
  )
}
