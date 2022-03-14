import { Disclosure } from "@headlessui/react"
import { useWeb3React } from "@web3-react/core"
import clsx from "clsx"

import ConnectButton from "@components/ConnectButton"
import DisclosureButton from "@components/ui/DisclosureButton"
import useModal from "@hooks/useModal"

function RightAside() {
  const { active, deactivate } = useWeb3React()
  const { showModal } = useModal()

  return (
    <>
      <div className="z-20 flex flex-col px-4 mb-8">
        <div>
          <ConnectButton />
        </div>
      </div>

      <div className="px-4 space-y-4">
        <Disclosure defaultOpen>
          {({ open }) => (
            <div>
              <DisclosureButton open={open} name="Settings" />
              <Disclosure.Panel>
                <div className="py-1.5 space-y-2">
                  <button
                    className={clsx(
                      "font-medium block tracking-2% md:text-sm 2xl:text-base transition hover:opacity-80",
                      {
                        "text-dark-50 cursor-not-allowed": !active,
                        "text-orange-600": active,
                      }
                    )}
                    onClick={deactivate}
                  >
                    Disconnect
                  </button>
                </div>
              </Disclosure.Panel>
            </div>
          )}
        </Disclosure>
      </div>
    </>
  )
}

export default RightAside
