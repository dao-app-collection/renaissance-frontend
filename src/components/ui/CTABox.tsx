function CTABox({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={`py-5 md:py-5 bg-black bg-opacity-60 sm:py-4 sm:px-10 px-4 rounded-xl ${className}`}
    >
      {children}
    </div>
  )
}

export default CTABox
