export const MaxButton = ({
  onClick,
  ...props
}: {
  onClick: VoidFunction
  styles?: string
} & React.HTMLAttributes<HTMLButtonElement>) => {
  return (
    <button
      onClick={onClick}
      className={`px-2 py-1 font-bold border text-accents-blue border-accents-blue bg-scheme-200 rounded-md whitespace-nowrap ${props?.styles}`}
      {...props}
    >
      Max amount
    </button>
  )
}
