import { Switch } from "@headlessui/react"

export default function ArtSwitch({
  enabled,
  onChange,
}: {
  enabled: boolean
  onChange: (enabled: boolean) => void
}) {
  return (
    <Switch
      checked={enabled}
      onChange={onChange}
      data-cy="stake-toggle"
      className="relative inline-flex items-center flex-shrink-0 border-2 border-transparent rounded-full cursor-pointer h-[33px] w-[65px] transition-colors ease-in-out duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 bg-dark-800"
    >
      <span className="sr-only">Use setting</span>
      <span
        aria-hidden="true"
        className={`${enabled ? "translate-x-8" : "translate-x-1"}
            pointer-events-none inline-block h-[25px] w-[25px] rounded-full bg-orange-600 shadow-lg transform ring-0 transition ease-in-out duration-200`}
      />
    </Switch>
  )
}
