import React from "react"

import create from "zustand"

interface ModalStore {
  isOpen: boolean
  open: () => void
  close: () => void
  showModal: (modal: React.ReactNode) => void
  modal: React.ReactNode
}

export const useModal = create<ModalStore>((set, get) => ({
  isOpen: false,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
  showModal: (modal) => set({ modal, isOpen: true }),
  modal: <></>,
}))

export function ModalProvider({ children }: { children: React.ReactNode }) {
  const modal = useModal((state) => state.modal)

  return (
    <>
      {children}
      {modal}
    </>
  )
}
