import React, { useEffect } from "react"

import { useWeb3React, Web3ReactProvider } from "@web3-react/core"
import { AppProps } from "next/app"
import { useRouter } from "next/router"
import { useDispatch } from "react-redux"

import Web3Manager from "@components/layouts/Web3Manager"
import { IS_PRODUCTION } from "@constants"
import { getProvider } from "@helper"
import getLibrary from "@helper/getLibrary"
import * as gtag from "@helper/gtag"
import { ModalProvider } from "@hooks/useModal"

import "../styles/tailwind.scss"

function Root({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch()
  const provider = getProvider()
  const { account, active } = useWeb3React()
  const chainId = Number(process.env.NEXT_PUBLIC_CHAIN_ID)

  return <>{children}</>
}

function MyApp({ Component, pageProps }: AppProps): JSX.Element {
  const router = useRouter()

  useEffect(() => {
    const handleRouteChange = (url: URL) => {
      if (IS_PRODUCTION) gtag.pageview(url)
    }
    router.events.on("routeChangeComplete", handleRouteChange)
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange)
    }
  }, [router.events])

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
