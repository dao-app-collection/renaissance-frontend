/**
 * TODO: Remove fake NFT list place holder once we start import actual NFT addresses and metadata.
 */
import { fNFTOfferingType } from "@helper/fNFTOfferingType"

import BoredApe11 from "../../public/images/bayc-11.png"
import Doodles102 from "../../public/images/doodles-102.png"
import Punk1 from "../../public/images/Punk-1.png"
import Sculpture12 from "../../public/images/sculpture-12.png"

export const fakeNFTListing = [
  {
    image: Doodles102,
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
    image: Sculpture12,
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
    image: Punk1,
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
    image: BoredApe11,
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

export default { fakeNFTListing }
