import React from "react"

import { useWeb3React, Web3ReactProvider } from "@web3-react/core"
import { AppProps } from "next/app"
import { useRouter } from "next/router"

import Web3Manager from "@components/layouts/Web3Manager"
import { getProvider } from "@helper"
import getLibrary from "@helper/getLibrary"
import { ModalProvider } from "@hooks/useModal"

import "../styles/tailwind.scss"

function Root({ children }: { children: React.ReactNode }) {
  const provider = getProvider()
  const { account, active } = useWeb3React()
  const chainId = Number(process.env.NEXT_PUBLIC_CHAIN_ID)

  return <>{children}</>
}

function MyApp({ Component, pageProps }: AppProps): JSX.Element {
  const router = useRouter()

  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <Web3Manager>
        <ModalProvider>
          <Root>
            <Component {...pageProps} />
          </Root>
        </ModalProvider>
      </Web3Manager>
    </Web3ReactProvider>
  )
}

export default MyApp
