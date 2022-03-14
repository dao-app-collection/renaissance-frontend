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
    ART_FRAX_BOND_ADDRESS: string
    FRAX_RESERVE_ADDRESS: string
    DAI_RESERVE_ADDRESS: string
    AART_PRESALE_ADDRESS: string
    ART_FRAX_RESERVE_ADDRESS: string
    AART_ADDRESS: string
  }
}

export const EPOCH_INTERVAL = 2200

// NOTE could get this from an outside source since it changes slightly over time
export const BLOCK_RATE_SECONDS = 20

export const TOKEN_DECIMALS = 9

export const BOND_REFRESH_INTERVAL = 60 * 1000

export const addresses: IAddresses = {
  // 4: {
  //   // Rinkeby
  //   ART_ADDRESS: "0xC0C4d0EAC7ffe53991AcB04Dd797EBb5014E02f2",
  //   SART_ADDRESS: "",
  //   STAKING_ADDRESS: "",
  //   STAKING_HELPER_ADDRESS: "",
  //   BONDINGCALC_ADDRESS: "0xFfcD2FD42974ff7de2bD28dc5A33ddc134C0EBfF",
  //   TREASURY_ADDRESS: "0x98e5404a965997784A7942Ac582211b6Dc8680AF",
  //   REDEEM_HELPER_ADDRESS: "",
  //   FRAX_BOND_ADDRESS: "",
  //   ART_FRAX_BOND_ADDRESS: "",
  //   FRAX_RESERVE_ADDRESS: "0xf934C7d48eB2029cfAaDFE7F7a9e26086cE70375",
  //   DAI_RESERVE_ADDRESS: "0x1c945cd9F3627fCa6A9c17Da0a4246dD6f5C1845",
  //   AART_PRESALE_ADDRESS: "0x227c15d7528717064e5Da0814Ad0ea9835177721",
  //   AART_ADDRESS: "0x4700bbCE5E8BC057f7aB43565998E9d5a55Ca7a4",
  //   DAI_ADDRESS: "0xB15638e4B951bf4E5c9330ED94eeC59eF2f6E61f",
  //   ART_FRAX_RESERVE_ADDRESS: "",
  // },
  1337: {
    // Localhost
    ART_ADDRESS: "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
    SART_ADDRESS: "0xe8cD911dc636B3757bAFE9d53F9dA014199b444c",
    STAKING_ADDRESS: "0x301F4585a5711F8887c7E0178E97379Fa562FA81",
    STAKING_HELPER_ADDRESS: "0x5E2aBbECf53cD68346ec203d655954Df8177BfCE",
    BONDINGCALC_ADDRESS: "0x5FC8d32690cc91D4c39d9d3abcBD16989F875707",
    TREASURY_ADDRESS: "0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9",
    REDEEM_HELPER_ADDRESS: "0xC11588Bf52f8985F680e28A8F13D79F584564EB8",
    FRAX_BOND_ADDRESS: "0xdeC5dA478115fD2EB6E010c7B3770d37611d6Ea1",
    ART_FRAX_BOND_ADDRESS: "0xDBB9Dd03dbe80d62dec711d4151C6880C35dDd94",
    FRAX_RESERVE_ADDRESS: "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9",
    DAI_RESERVE_ADDRESS: "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0",
    AART_PRESALE_ADDRESS: "0xa513E6E4b8f2a923D98304ec87F64353C4D5C853",
    AART_ADDRESS: "0x0165878A594ca255338adfa4d48449f69242Eb8F",
    DAI_ADDRESS: "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0",
    ART_FRAX_RESERVE_ADDRESS: "0x069C2065100b4D3D982383f7Ef3EcD1b95C05894", // needs to change
  }, // ren authority 0x5FbDB2315678afecb367f032d93F642f64180aa3
  1313161555: {
    // Aurora testnet
    ART_ADDRESS: "0x2676a7f8187a6AAB300149fC30949715A8a42b3a",
    SART_ADDRESS: "0xe8cD911dc636B3757bAFE9d53F9dA014199b444c", // placeholder
    STAKING_ADDRESS: "0x301F4585a5711F8887c7E0178E97379Fa562FA81", // placeholder
    STAKING_HELPER_ADDRESS: "0x5E2aBbECf53cD68346ec203d655954Df8177BfCE", //placeholder
    BONDINGCALC_ADDRESS: "0x9d55337183AF0EAD4f75ad061E13a098b2d3DD06",
    TREASURY_ADDRESS: "0x52A4C7AC1cFEC5b466379175d2F945acd1859726",
    REDEEM_HELPER_ADDRESS: "0xC11588Bf52f8985F680e28A8F13D79F584564EB8", //placeholder
    FRAX_BOND_ADDRESS: "0xdeC5dA478115fD2EB6E010c7B3770d37611d6Ea1", // placeholders. need to edit this.
    ART_FRAX_BOND_ADDRESS: "0xDBB9Dd03dbe80d62dec711d4151C6880C35dDd94", // placeholder
    FRAX_RESERVE_ADDRESS: "0xD13F312EA12708A942994f04F1F1d2D86b430ddD",
    DAI_RESERVE_ADDRESS: "0x1b923302d578d3D00E2450dEFb1aB1459304ed0a",
    AART_PRESALE_ADDRESS: "0xD02Db8093a6193dF17C6e67D0298dEC65f8c2F8e",
    AART_ADDRESS: "0xC42F0fa0e805e75a5fD25662746915d6a908272C",
    DAI_ADDRESS: "0xB15638e4B951bf4E5c9330ED94eeC59eF2f6E61f", // placdholer
    ART_FRAX_RESERVE_ADDRESS: "0x069C2065100b4D3D982383f7Ef3EcD1b95C05894", // placeholder
  },
  1313161554: {
    // Aurora mainnet
    ART_ADDRESS: "0x4Da92664A416B16335f67D670541Ec4D1F0688E5",
    SART_ADDRESS: "0xe8cD911dc636B3757bAFE9d53F9dA014199b444c", // placeholder
    STAKING_ADDRESS: "0x301F4585a5711F8887c7E0178E97379Fa562FA81", // placeholder
    STAKING_HELPER_ADDRESS: "0x5E2aBbECf53cD68346ec203d655954Df8177BfCE", //placeholder
    BONDINGCALC_ADDRESS: "0xEdc4C55E2f517acB2b22a7BA440D410723Ec7317",
    TREASURY_ADDRESS: "0xfBD653f0A8E224c7C01073949A1A2ADFCea33806",
    REDEEM_HELPER_ADDRESS: "0xC11588Bf52f8985F680e28A8F13D79F584564EB8", //placeholder
    FRAX_BOND_ADDRESS: "0xdeC5dA478115fD2EB6E010c7B3770d37611d6Ea1", // placeholders. need to edit this.
    ART_FRAX_BOND_ADDRESS: "0xDBB9Dd03dbe80d62dec711d4151C6880C35dDd94", //
    FRAX_RESERVE_ADDRESS: "0xda2585430fef327ad8ee44af8f1f989a2a91a3d2",
    DAI_RESERVE_ADDRESS: "0xe3520349f477a5f6eb06107066048508498a291b",
    AART_PRESALE_ADDRESS: "0xBcf649f47d3E2F10bC26CEc444020F907334Aa41",
    AART_ADDRESS: "0x318fE0ED13516934C4ea90d636bBffF615a05B55",
    DAI_ADDRESS: "0xB15638e4B951bf4E5c9330ED94eeC59eF2f6E61f", // placdholer
    ART_FRAX_RESERVE_ADDRESS: "0x069C2065100b4D3D982383f7Ef3EcD1b95C05894", // placeholder
  },
  1285: {
    // Movr mainnet
    ART_ADDRESS: "0x4a436073552044D5f2f49B176853ad3Ad473d9d6",
    SART_ADDRESS: "0x89f52002e544585b42f8c7cf557609ca4c8ce12a", // placeholder
    STAKING_ADDRESS: "0x6f7D019502e17F1ef24AC67a260c65Dd23b759f1", // placeholder
    STAKING_HELPER_ADDRESS: "0x37f9A9436F5dB1ac9e346eAAB482f138DA0D8749", //placeholder
    BONDINGCALC_ADDRESS: "0x3b5bbC9d8243C6661CcadAdE17B68344770c20FD",
    TREASURY_ADDRESS: "0xfbAD41e4Dd040BC80c89FcC6E90d152A746139aF",
    REDEEM_HELPER_ADDRESS: "0x697a247544a27bf7F7a172E910c817436DE2b9B1", //placeholder
    FRAX_BOND_ADDRESS: "0xE2F71c68db7ECC0c9A907AD2E40E2394c5CAc367", // placeholders. need to edit this.
    ART_FRAX_BOND_ADDRESS: "0x065588602bd7206B15f9630FDB2e81E4Ca51ad8A", //
    FRAX_RESERVE_ADDRESS: "0x1A93B23281CC1CDE4C4741353F3064709A16197d",
    DAI_RESERVE_ADDRESS: "0x0caE51e1032e8461f4806e26332c030E34De3aDb", //MIM
    AART_PRESALE_ADDRESS: "0x093973DCa8F8daB14398b7e472E69F75869Bc824",
    AART_ADDRESS: "0x3D2D044E8C6dAd46b4F7896418d3d4DFaAD902bE",
    DAI_ADDRESS: "0x0caE51e1032e8461f4806e26332c030E34De3aDb", // placdholer
    ART_FRAX_RESERVE_ADDRESS: "0x069C2065100b4D3D982383f7Ef3EcD1b95C05894", // placeholder
  },
}

export const IS_PRODUCTION = process.env.NODE_ENV === "production"

interface IKeys {
  [key: string]: number | string
}
export const keys: IKeys = {
  token: "art",
  stoken: "sArt",
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
  1313161554: {
    chainId: "0x4e454152",
    chainName: "Aurora Mainnet",
    rpcUrls: ["https://mainnet.aurora.dev"],
    blockExplorerUrls: ["https://explorer.mainnet.aurora.dev/"],
    nativeCurrency: {
      name: "ETH",
      symbol: "ETH",
      decimals: 18,
    },
  },
  1313161555: {
    chainId: "0x4e454153",
    chainName: "Aurora Testnet",
    rpcUrls: ["https://testnet.aurora.dev"],
    blockExplorerUrls: ["https://explorer.testnet.aurora.dev/"],
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
    rpcUrls: ["https://rpc.api.moonriver.moonbeam.network"],
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
