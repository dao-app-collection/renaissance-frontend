function Card({
  children,
  className,
  ...props
}: {
  children: React.ReactNode
  className?: string
  props?: React.HTMLAttributes<HTMLDivElement>
}) {
  return (
    <div
      className={`bg-white rounded-bl-[15px] rounded-tr-[15px] ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}

export default Card
