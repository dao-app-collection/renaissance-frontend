import { Dialog } from "@headlessui/react"
import { XIcon } from "@heroicons/react/outline"
import { useWeb3React } from "@web3-react/core"
import Image from "next/image"

import { injected, walletconnect } from "@connectors/connectors"
import { useModal } from "@hooks/useModal"

import BaseModal from "./BaseModal"

function ConnectorModal() {
  const close = useModal((state) => state.close)

  const { activate, active } = useWeb3React()

  return (
    <BaseModal>
      <div className="inline-block w-full px-12 py-10 my-8 overflow-hidden align-middle shadow-xl bg-scheme-600 sm:w-[450px] transition-all transform rounded-2xl">
        <div className="flex justify-between">
          <Dialog.Title
            as="h3"
            className="text-xl font-medium text-gray-50 leading-6"
          >
            Select a Wallet
          </Dialog.Title>

          <button onClick={close}>
            <XIcon className="w-6 h-6" />
          </button>
        </div>

        <div className="w-full mt-8 space-y-4">
          <button
            className="flex items-center justify-between w-full px-4 font-medium rounded-lg bg-dark-900 py-2.5 hover:bg-opacity-80 transition"
            onClick={async () => {
              await activate(injected)
              close()
            }}
          >
            <span className="text-gray-50">MetaMask</span>

            <Image
              src="/images/connectors/metamask-fox.svg"
              width={32}
              priority
              height={32}
              alt="MetaMask"
            />
          </button>

          <button
            className="flex items-center justify-between w-full px-4 font-medium rounded-lg bg-dark-900 py-2.5 hover:bg-opacity-80 transition"
            onClick={async () => {
              await activate(walletconnect)
              close()
            }}
          >
            <span className="text-gray-50">WalletConnect</span>

            <Image
              src="/images/connectors/walletconnect-logo.svg"
              width={32}
              height={32}
              priority
              alt="WalletConnect"
            />
          </button>
        </div>
      </div>
    </BaseModal>
  )
}

export default ConnectorModal
