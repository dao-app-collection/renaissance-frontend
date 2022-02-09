interface IAddresses {
  [chainId: number]: {
    DAI_ADDRESS: string
    ART_ADDRESS: string
    SART_ADDRESS: string
    STAKING_ADDRESS: string
    STAKING_HELPER_ADDRESS: string
    BONDINGCALC_ADDRESS: string
    TREASURY_ADDRESS: string
    REDEEM_HELPER_ADDRESS: string
    FRAX_BOND_ADDRESS: string
    MIM_BOND_ADDRESS: string
    ART_FRAX_BOND_ADDRESS: string
    MIM_RESERVE_ADDRESS: string
    FRAX_RESERVE_ADDRESS: string
    DAI_RESERVE_ADDRESS: string
    AART_PRESALE_ADDRESS: string
    ART_FRAX_RESERVE_ADDRESS: string
    AART_ADDRESS: string
  }
}

export const EPOCH_INTERVAL = 2200

// NOTE could get this from an outside source since it changes slightly over time
export const BLOCK_RATE_SECONDS = 13

export const TOKEN_DECIMALS = 9

export const addresses: IAddresses = {
  //MOONRIVER MAINNET
  1285: {
    ART_ADDRESS: "0x4a436073552044D5f2f49B176853ad3Ad473d9d6",
    SART_ADDRESS: "0x89f52002e544585b42f8c7cf557609ca4c8ce12a",
    STAKING_ADDRESS: "0x6f7D019502e17F1ef24AC67a260c65Dd23b759f1",
    STAKING_HELPER_ADDRESS: "0x37f9A9436F5dB1ac9e346eAAB482f138DA0D8749",
    BONDINGCALC_ADDRESS: "0x3b5bbC9d8243C6661CcadAdE17B68344770c20FD",
    TREASURY_ADDRESS: "0xfbAD41e4Dd040BC80c89FcC6E90d152A746139aF",
    REDEEM_HELPER_ADDRESS: "0x697a247544a27bf7F7a172E910c817436DE2b9B1",
    FRAX_BOND_ADDRESS: "0xE2F71c68db7ECC0c9A907AD2E40E2394c5CAc367",
    MIM_BOND_ADDRESS: "0x91a5184741FDc64f7507A7db6Aa3764a747f8089",
    ART_FRAX_BOND_ADDRESS: "0x065588602bd7206B15f9630FDB2e81E4Ca51ad8A",
    MIM_RESERVE_ADDRESS: "0x0caE51e1032e8461f4806e26332c030E34De3aDb",
    FRAX_RESERVE_ADDRESS: "0x1A93B23281CC1CDE4C4741353F3064709A16197d",
    DAI_RESERVE_ADDRESS: "0x80A16016cC4A2E6a2CACA8a4a498b1699fF0f844",
    ART_FRAX_RESERVE_ADDRESS: "0x069C2065100b4D3D982383f7Ef3EcD1b95C05894",
    AART_PRESALE_ADDRESS: "0x093973DCa8F8daB14398b7e472E69F75869Bc824",
    AART_ADDRESS: "0x3D2D044E8C6dAd46b4F7896418d3d4DFaAD902bE",
    DAI_ADDRESS: "0x80A16016cC4A2E6a2CACA8a4a498b1699fF0f844",
  },
  1337: {
    ART_ADDRESS: "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
    SART_ADDRESS: "0xe8cD911dc636B3757bAFE9d53F9dA014199b444c",
    STAKING_ADDRESS: "0x301F4585a5711F8887c7E0178E97379Fa562FA81",
    STAKING_HELPER_ADDRESS: "0x5E2aBbECf53cD68346ec203d655954Df8177BfCE",
    BONDINGCALC_ADDRESS: "0x5FC8d32690cc91D4c39d9d3abcBD16989F875707",
    TREASURY_ADDRESS: "0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9",
    REDEEM_HELPER_ADDRESS: "0xC11588Bf52f8985F680e28A8F13D79F584564EB8",
    FRAX_BOND_ADDRESS: "0xdeC5dA478115fD2EB6E010c7B3770d37611d6Ea1",
    MIM_BOND_ADDRESS: "0x55b5049eB78B032C29e629D8875862473cBE768A",
    ART_FRAX_BOND_ADDRESS: "0xDBB9Dd03dbe80d62dec711d4151C6880C35dDd94",
    MIM_RESERVE_ADDRESS: "0xd5F7c1D36669ca34b4E9e8A56aB573b8375cBBd5",
    FRAX_RESERVE_ADDRESS: "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9",
    DAI_RESERVE_ADDRESS: "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0",
    AART_PRESALE_ADDRESS: "0xa513E6E4b8f2a923D98304ec87F64353C4D5C853",
    AART_ADDRESS: "0x0165878A594ca255338adfa4d48449f69242Eb8F",
    DAI_ADDRESS: "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0",
    ART_FRAX_RESERVE_ADDRESS: "0x069C2065100b4D3D982383f7Ef3EcD1b95C05894", // needs to change
  }, // ren authority 0x5FbDB2315678afecb367f032d93F642f64180aa3
  // 1: {
  //   DAI_ADDRESS: "0x6b175474e89094c44da98b954eedeac495271d0f",

  //   FRAX_BOND_ADDRESS: "0x8510c8c2B6891E04864fa196693D44E6B6ec2514",
  //   FRAX_RESERVE_ADDRESS: "0x853d955acef822db058eb8505911ed77f175b99e",
  //   MIM_BOND_ADDRESS: "0x575409F8d77c12B05feD8B455815f0e54797381c",
  //   MIM_RESERVE_ADDRESS: "0x6b175474e89094c44da98b954eedeac495271d0f",
  //   ART_FRAX_BOND_ADDRESS: "0xc20CffF07076858a7e642E396180EC390E5A02f7",
  //   ART_FRAX_RESERVE_ADDRESS: "0x2dce0dda1c2f98e0f171de8333c3c6fe1bbf4877",
  //   SART_ADDRESS: "0x04F2694C8fcee23e8Fd0dfEA1d4f5Bb8c352111F",
  //   ART_ADDRESS: "0x383518188c0c6d7730d91b2c03a03c837814a899",
  //   STAKING_ADDRESS: "0xfd31c7d00ca47653c6ce64af53c1571f9c36566a",
  //   STAKING_HELPER_ADDRESS: "0xc8c436271f9a6f10a5b80c8b8ed7d0e8f37a612d",
  //   BONDINGCALC_ADDRESS: "0xcaaa6a2d4b26067a391e7b7d65c16bb2d5fa571a",
  //   TREASURY_ADDRESS: "0x31f8cc382c9898b273eff4e0b7626a6987c846e8",
  //   REDEEM_HELPER_ADDRESS: "0xE1e83825613DE12E8F0502Da939523558f0B819E",
  // },
  // //We're testing in eth mainnet for development. Change the chainId's to moonriver
  // 4: {
  //   DAI_ADDRESS: "0xB2180448f8945C8Cc8AE9809E67D6bd27d8B2f2C",
  //   FRAX_BOND_ADDRESS: "0xF651283543fB9D61A91f318b78385d187D300738",
  //   FRAX_RESERVE_ADDRESS: "0x2F7249cb599139e560f0c81c269Ab9b04799E453",
  //   MIM_BOND_ADDRESS: "0xDea5668E815dAF058e3ecB30F645b04ad26374Cf",
  //   MIM_RESERVE_ADDRESS: "0xB2180448f8945C8Cc8AE9809E67D6bd27d8B2f2C",
  //   ART_FRAX_BOND_ADDRESS: "0x7BB53Ef5088AEF2Bb073D9C01DCa3a1D484FD1d2",
  //   ART_FRAX_RESERVE_ADDRESS: "0x11BE404d7853BDE29A3e73237c952EcDCbBA031E",
  //   SART_ADDRESS: "0x1Fecda1dE7b6951B248C0B62CaeBD5BAbedc2084",
  //   ART_ADDRESS: "0xC0b491daBf3709Ee5Eb79E603D73289Ca6060932",
  //   STAKING_ADDRESS: "0xC5d3318C0d74a72cD7C55bdf844e24516796BaB2",
  //   STAKING_HELPER_ADDRESS: "0xf73f23Bb0edCf4719b12ccEa8638355BF33604A1",
  //   BONDINGCALC_ADDRESS: "0xaDBE4FA3c2fcf36412D618AfCfC519C869400CEB",
  //   TREASURY_ADDRESS: "0x0d722D813601E48b7DAcb2DF9bae282cFd98c6E7",
  //   REDEEM_HELPER_ADDRESS: "0xBd35d8b2FDc2b720842DB372f5E419d39B24781f",
  // },
}

export const GA_TRACKING_ID = "G-65Y9MD58D3"

export const IS_PRODUCTION = process.env.NODE_ENV === "production"

interface IKeys {
  [key: string]: number | string
}
export const keys: IKeys = {
  token: "rome",
  stoken: "srome",
  mainnetName: "eth",
  testnetName: "",
  mainnetChainID: 1,
  testnetChainID: 4,
}

interface IChain {
  [key: string]: {
    chainId: string
    chainName: string
    rpcUrls: string[]
    nativeCurrency: {
      name: string
      symbol: string
      decimals: number
    }
    blockExplorerUrls: string[]
  }
}

// DO NOT CHANGE KEY PROPERTIES
// Metamask needs exactly these properties to work (e.g adding new network, additional keys will break that)
export const chains: IChain = {
  1313161555: {
    chainId: "0x4e454153",
    chainName: "Aurora Testnet",
    rpcUrls: ["https://testnet.aurora.dev"],
    blockExplorerUrls: ["https://testnet.aurora.dev"],
    nativeCurrency: {
      name: "ETH",
      symbol: "ETH",
      decimals: 18,
    },
  },
  1287: {
    chainId: "0x507",
    chainName: "Moonbase Alpha",
    rpcUrls: ["https://rpc.testnet.moonbeam.network"],
    nativeCurrency: {
      name: "DEV",
      symbol: "DEV",
      decimals: 18,
    },
    blockExplorerUrls: [
      "https://moonbase-blockscout.testnet.moonbeam.network/",
    ],
  },
  1285: {
    chainId: "0x505",
    chainName: "Moonriver",
    rpcUrls: ["https://rpc.moonriver.moonbeam.network"],
    nativeCurrency: {
      name: "MOVR",
      symbol: "MOVR",
      decimals: 18,
    },
    blockExplorerUrls: ["https://moonriver.subscan.io/"],
  },
  1337: {
    chainId: "0x539",
    chainName: "Localhost 8545",
    rpcUrls: ["http://localhost:8545"],

    nativeCurrency: {
      name: "ETH",
      symbol: "ETH",
      decimals: 18,
    },
    blockExplorerUrls: ["https://rinkeby.etherscan.io"],
  },
  1: {
    chainId: "0x1",
    chainName: "Ethereum Mainnet",
    rpcUrls: ["https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161"],
    nativeCurrency: {
      name: "ETH",
      symbol: "ETH",
      decimals: 18,
    },
    blockExplorerUrls: ["https://etherscan.io"],
  },
}

export type Chain = keyof typeof chains

const getChain = (chainId: number) => {
  return chains[chainId]
}

export const getAddresses = (chainId: Chain) => {
  return addresses[chainId]
}

export const currentAddresses = getAddresses(
  parseInt(process.env.NEXT_PUBLIC_CHAIN_ID)
)

export default getChain
