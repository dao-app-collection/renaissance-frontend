import { Dialog } from "@headlessui/react"
import { XIcon } from "@heroicons/react/outline"

import ReportBugForm from "@components/forms/ReportBugForm"
import useModal from "@hooks/useModal"

import BaseModal from "./BaseModal"

function ReportBugModal() {
  const { close } = useModal()

  return (
    <BaseModal>
      <div
        className="inline-block w-full px-12 py-10 my-8 overflow-hidden align-middle bg-white rounded-lg shadow-xl sm:w-[450px] transition-all transform"
        data-cy="report-bug-modal"
      >
        <div className="flex justify-between">
          <Dialog.Title
            as="h3"
            className="text-xl font-medium leading-6 text-gray-900"
          >
            Report A Bug
          </Dialog.Title>

          <button onClick={close} data-cy="close-report-modal">
            <XIcon className="w-6 h-6" />
          </button>
        </div>

        <div className="w-full mt-8 space-y-4">
          <ReportBugForm />
        </div>
      </div>
    </BaseModal>
  )
}

export default ReportBugModal
