import ArtExternal from "@components/ui/ArtLinkExternal"
import Card from "@components/ui/Card"
import { INewsItem } from "@typings"

function NewsItem({ item }: { item: INewsItem }) {
  return (
    <Card className="px-4 py-4 lg:px-4 shadow-card">
      <p className="flex items-center font-semibold md:text-sm 2xl:text-base gap-2 text-dark-1000 tracking-2%">
        {item.name}
      </p>

      <p className="mt-1 font-medium text-dark-100 tracking-2% md:text-sm 2xl:text-base">
        {item.date}
      </p>

      <div className="mt-2">
        <ArtExternal href={item.link} dataCy={`${item.name}-link`}>
          Read now
        </ArtExternal>
      </div>
    </Card>
  )
}

export default NewsItem
