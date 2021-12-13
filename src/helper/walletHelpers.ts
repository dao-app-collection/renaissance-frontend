import getChain from "@constants"

const chain = getChain(parseInt(process.env.NEXT_PUBLIC_CHAIN_ID))

async function addTokenToMetamask(
  address: string,
  symbol: string,
  decimals: number
) {
  await window["ethereum"].request({
    method: "wallet_watchAsset",
    params: {
      type: "ERC20", // Initially only supports ERC20, but eventually more!
      options: {
        address: address, // The address that the token is at.
        symbol: symbol, // A ticker symbol or shorthand, up to 5 chars.
        decimals: decimals, // The number of decimals in the token
        // image: `${window?.location?.origin}/images/renaissance_meta.png`, // A string url of the token logo
      },
    },
  })
}

async function switchChains() {
  try {
    await window["ethereum"].request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: chain.chainId }],
    })
  } catch (error) {
    if (error.code === 4902 || error.code === -32603) {
      await addChain()
    }
  }
}

async function addChain() {
  try {
    await window["ethereum"].request({
      method: "wallet_addEthereumChain",
      params: [
        {
          ...chain,
        },
      ],
    })
  } catch (addError) {
    console.error(addError)
  }
}

export { addTokenToMetamask, switchChains, addChain }
