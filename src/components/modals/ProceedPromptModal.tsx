import { Dialog } from "@headlessui/react"
import { XIcon } from "@heroicons/react/outline"
import clsx from "clsx"
import { Hiker, useHikerContext } from "react-hiker"

import Steps, { Step } from "@components/Steps"
import useModal from "@hooks/useModal"

import BaseModal from "./BaseModal"

function ProceedPromptModal({
  onProceed,
  overview,
}: {
  onProceed: () => void
  overview: React.ReactNode
}) {
  const { close } = useModal()

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
                  <button
                    className="w-full button-gray button sm:w-auto hover:opacity-90 transition"
                    onClick={next}
                  >
                    Light money on fire
                  </button>
                )}
              </Hiker.Button>

              <button
                className="w-full button-primary button sm:w-auto hover:opacity-90 transition"
                onClick={close}
              >
                I'll wait
              </button>
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
                    <button
                      className="w-full button-gray button sm:w-auto hover:opacity-90 transition"
                      onClick={() => {
                        onProceed()
                        close()
                      }}
                    >
                      Purchase Bond
                    </button>
                  )}
                </Hiker.Button>

                <button
                  className="w-full button-primary button sm:w-auto hover:opacity-90 transition"
                  onClick={close}
                >
                  Cancel Bond
                </button>
              </div>
            </div>
          </Hiker.Step>
        </Hiker>
      </div>
    </BaseModal>
  )
}

function Waypoints() {
  const { length, activeIndex } = useHikerContext()

  return (
    <div className="flex justify-center">
      <div className="flex space-x-3">
        {Array.from(Array(length), (e, i) => (
          <div
            className={clsx("w-2 h-2 bg-gray-400 rounded-full transition", {
              "bg-gray-400 rounded-full ring-2 ring-gray-300":
                activeIndex === i,
            })}
            key={i}
          />
        ))}
      </div>
    </div>
  )
}

function HikerSteps() {
  const { activeIndex, next } = useHikerContext()

  const getStepStatus = (index: number) => {
    if (index === activeIndex + 1) {
      return "current"
    }

    if (activeIndex + 1 < index) {
      return "upcoming"
    }

    if (activeIndex + 1 > index) {
      return "complete"
    }
  }

  const steps: Step[] = [
    { id: 1, status: getStepStatus(1) },
    { id: 2, status: getStepStatus(2) },
  ]

  return <Steps steps={steps} />
}

export default ProceedPromptModal
