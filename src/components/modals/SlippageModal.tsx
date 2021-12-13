import { Dialog } from "@headlessui/react"
import { XIcon } from "@heroicons/react/outline"

import useModal from "@hooks/useModal"

import BaseModal from "./BaseModal"

function SlippageModal() {
  const { close } = useModal()

  return (
    <BaseModal>
      <div className="inline-block w-full px-12 py-10 my-8 overflow-hidden align-middle bg-white shadow-xl sm:w-[450px] transition-all transform rounded-2xl">
        <div className="flex justify-between">
          <Dialog.Title
            as="h3"
            className="text-xl font-medium text-gray-900 leading-6"
          >
            Set Slippage
          </Dialog.Title>

          <button onClick={close}>
            <XIcon className="w-6 h-6" />
          </button>
        </div>

        <div className="w-full mt-8"></div>
      </div>
    </BaseModal>
  )
}

export default SlippageModal
