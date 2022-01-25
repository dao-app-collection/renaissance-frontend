interface PageHeadingProps {
  children: React.ReactNode
}

function PageHeading({ children }: PageHeadingProps) {
  return (
    <section className="w-full sm:flex space-y-8 sm:space-y-0">
      {children}
    </section>
  )
}

PageHeading.Title = function PageHeadingTitle({
  children,
}: {
  children: string
}) {
  return (
    <p className="items-center text-3xl font-semibold text-white gap-2 sm:text-3xl tracking-2%">
      {children}
    </p>
  )
}

PageHeading.Subtitle = function PageHeadingSubTitle({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <p className="mt-1 text-sm font-medium text-dark-100 tracking-2%">
      {children}
    </p>
  )
}

interface StatProps {
  title: string
  subtitle: React.ReactNode
}

PageHeading.Stat = function PageHeadingStat({ title, subtitle }: StatProps) {
  return (
    <div className="sm:text-left">
      <div className="text-sm font-medium text-dark-100">{title}</div>
      <div className="mt-1 text-xl font-medium text-white 2xl:text-xl">
        {subtitle}
      </div>
    </div>
  )
}

PageHeading.Content = function Content({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="inline-flex flex-wrap items-baseline justify-items-start xl:gap-12 gap-6 md:flex-nowrap">
      {children}
    </div>
  )
}

export default PageHeading
