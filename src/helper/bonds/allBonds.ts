import ArtFraxBondAbi from "@abi/bonds/ArtFraxBondAbi.json"
import ArtFraxAbi from "@abi/reserves/ArtFraxAbi.json"
import FraxIcon from "@components/customicons/FraxIcon"
import { currentAddresses } from "@constants"
import { StableBond, LPBond } from "@helper/bonds/bondConstructor"
import FraxBondAbi from "src/abi/bonds/FraxBondAbi.json"

export const frax = new StableBond({
  name: "frax",
  displayName: "FRAX",
  bondToken: "FRAX",
  isAvailable: true,
  bondIconSvg: FraxIcon,
  bondContractABI: FraxBondAbi.abi,
  networkAddrs: {
    bondAddress: currentAddresses.FRAX_BOND_ADDRESS,
    reserveAddress: currentAddresses.FRAX_RESERVE_ADDRESS,
  },
})

export const art_frax = new LPBond({
  name: "art_frax_lp",
  displayName: "ART-FRAX LP",
  bondToken: "FRAX",
  isAvailable: true,
  bondIconSvg: FraxIcon,
  bondContractABI: ArtFraxBondAbi.abi,
  reserveContract: ArtFraxAbi.abi,
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
export const allBonds = [frax, art_frax] //frax, art_frax
export const allBondsMap = allBonds.reduce((prevVal, bond) => {
  return { ...prevVal, [bond.name]: bond }
}, {})

export default allBonds
