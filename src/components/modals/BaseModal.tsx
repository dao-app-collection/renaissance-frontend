import { Fragment } from "react"

import { Dialog, Transition } from "@headlessui/react"

import { useModal } from "@hooks/useModal"

interface BaseModalProps {
  children: React.ReactNode
  overlay?: React.ReactNode
}

const baseOverlay = (
  <Dialog.Overlay className="fixed inset-0 bg-black opacity-70" />
)

function BaseModal({ children, overlay = baseOverlay }: BaseModalProps) {
  const [isOpen, close] = useModal((state) => [state.isOpen, state.close])

  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-50 flex justify-center overflow-y-auto"
          onClose={close}
        >
          <div className="w-full min-h-screen px-4 sm:w-auto">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              {overlay}
            </Transition.Child>

            {/* This element is to trick the browser into centering the modal contents. */}
            <span
              className="inline-block h-screen align-middle"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              {children}
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </>
  )
}

export default BaseModal
