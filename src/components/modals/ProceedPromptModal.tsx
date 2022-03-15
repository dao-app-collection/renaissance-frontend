import { Dialog } from "@headlessui/react"
import { XIcon } from "@heroicons/react/outline"
import { Hiker } from "react-hiker"

import Button from "@components/ui/Buttons"
import { useModal } from "@hooks/useModal"

import BaseModal from "./BaseModal"

function ProceedPromptModal({
  onProceed,
  overview,
}: {
  onProceed: () => void
  overview: React.ReactNode
}) {
  const close = useModal((state) => state.close)

  return (
    <BaseModal>
      <div className="relative self-start inline-block w-full px-12 py-10 my-8 overflow-hidden align-middle bg-white rounded-lg shadow-xl sm:w-[550px] transition-all transform">
        <Hiker>
          <button onClick={close} className="absolute right-6 top-6">
            <XIcon className="w-6 h-6" />
          </button>

          <div className="mt-4"></div>

          <Hiker.Step id="1">
            <Dialog.Title
              as="h3"
              className="text-xl font-bold text-gray-900 leading-6"
            >
              Note!
            </Dialog.Title>

            <p className="mt-2">
              This bond is currently at a negative discount. Please consider
              waiting until bond returns to positive discount.
            </p>
            <p className="mt-5 font-semibold">What do you want to do?</p>

            <div className="inline-flex flex-wrap mt-6 gap-4">
              <Hiker.Button>
                {({ next }) => (
                  <Button
                    className="w-full button-gray button sm:w-auto hover:opacity-90 transition"
                    onClick={next}
                  >
                    Light money on fire
                  </Button>
                )}
              </Hiker.Button>

              <Button
                className="w-full button-primary button sm:w-auto hover:opacity-90 transition"
                onClick={close}
              >
                I'll wait
              </Button>
            </div>
          </Hiker.Step>

          <Hiker.Step id="2">
            <Dialog.Title
              as="h3"
              className="text-xl font-bold text-gray-900 leading-6"
            >
              Purchase Bond
            </Dialog.Title>

            <p className="mt-2">
              You are bonding for a negative discount, are you SURE? There’s no
              turning back once you purchase the bond...
            </p>

            {overview}

            <div className="flex justify-center">
              <div className="inline-flex flex-wrap mt-6 gap-4">
                <Hiker.Button>
                  {({ next }) => (
                    <Button
                      className="w-full button-gray button sm:w-auto hover:opacity-90 transition"
                      onClick={() => {
                        onProceed()
                        close()
                      }}
                    >
                      Purchase Bond
                    </Button>
                  )}
                </Hiker.Button>

                <Button
                  className="w-full button-primary button sm:w-auto hover:opacity-90 transition"
                  onClick={close}
                >
                  Cancel Bond
                </Button>
              </div>
            </div>
          </Hiker.Step>
        </Hiker>
      </div>
    </BaseModal>
  )
}

export default ProceedPromptModal
