import React from "react"
import { useState } from "react"

interface ModalContext {
  isOpen: boolean
  close: () => void
  open: () => void
  showModal: (modal: React.ReactNode) => void
}

export const ModalContext = React.createContext<ModalContext>({
  isOpen: false,
  open: () => null,
  close: () => null,
  showModal: () => null,
})

export function ModalProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const [modal, setModal] = useState<React.ReactNode>(<></>)

  const close = () => {
    setIsOpen(false)
  }

  const open = () => {
    setIsOpen(true)
  }

  const showModal = (modal: React.ReactNode) => {
    setModal(modal)
    setIsOpen(true)
  }

  return (
    <ModalContext.Provider value={{ isOpen, close, open, showModal }}>
      <>
        {children}
        {modal}
      </>
    </ModalContext.Provider>
  )
}

function useModal() {
  return React.useContext(ModalContext)
}

export default useModal
