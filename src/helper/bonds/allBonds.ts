import ArtFraxBondContract from "@abi/bonds/ArtFraxContract.json"
import ReserveArtFraxContract from "@abi/reserves/ArtFrax.json"
import FraxIcon from "@components/customicons/FraxIcon"
import { currentAddresses } from "@constants"
import { StableBond, LPBond } from "@helper/bonds/bondConstructor"
import FraxBondContract from "src/abi/bonds/FraxContract.json"
import MimBondContract from "src/abi/bonds/MimContract.json"

export const frax = new StableBond({
  name: "frax",
  displayName: "FRAX",
  bondToken: "FRAX",
  isAvailable: true,
  bondIconSvg: FraxIcon,
  bondContractABI: FraxBondContract.abi,
  networkAddrs: {
    bondAddress: currentAddresses.FRAX_BOND_ADDRESS,
    reserveAddress: currentAddresses.FRAX_RESERVE_ADDRESS,
  },
})

export const mim = new StableBond({
  name: "mim",
  displayName: "MIM",
  bondToken: "MIM",
  isAvailable: true,
  bondIconSvg: FraxIcon,
  bondContractABI: MimBondContract.abi,
  networkAddrs: {
    bondAddress: currentAddresses.MIM_BOND_ADDRESS,
    reserveAddress: currentAddresses.MIM_RESERVE_ADDRESS,
  },
})

export const art_frax = new LPBond({
  name: "art_frax_lp",
  displayName: "ART-FRAX LP",
  bondToken: "FRAX",
  isAvailable: true,
  bondIconSvg: FraxIcon,
  bondContractABI: ArtFraxBondContract.abi,
  reserveContract: ReserveArtFraxContract.abi,
  networkAddrs: {
    bondAddress: currentAddresses.ART_FRAX_BOND_ADDRESS,
    reserveAddress: currentAddresses.ART_FRAX_RESERVE_ADDRESS,
  },
  lpUrl: "",
})

// HOW TO ADD A NEW BOND:
// Is it a stableCoin bond? use `new StableBond`
// Is it an LP Bond? use `new LPBond`
// Add new bonds to this array!!
export const allBonds = [frax, mim, art_frax]
export const allBondsMap = allBonds.reduce((prevVal, bond) => {
  return { ...prevVal, [bond.name]: bond }
}, {})

export default allBonds
