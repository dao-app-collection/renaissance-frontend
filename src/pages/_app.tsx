import React from "react"

import { Web3ReactProvider } from "@web3-react/core"
import { AppProps } from "next/app"
import { useRouter } from "next/router"

import Web3Manager from "@components/layouts/Web3Manager"
import getLibrary from "@helper/getLibrary"
import { ModalProvider } from "@hooks/useModal"

import "../styles/tailwind.scss"

function MyApp({ Component, pageProps }: AppProps): JSX.Element {
  const router = useRouter()

  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <Web3Manager>
        <ModalProvider>
          <Component {...pageProps} />
        </ModalProvider>
      </Web3Manager>
    </Web3ReactProvider>
  )
}

export default MyApp
