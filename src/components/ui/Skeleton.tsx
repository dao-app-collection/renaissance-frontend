import React from "react"

import ContentLoader from "react-content-loader"

const Skeleton = (props: any) => {
  const height = props.height ? props.height : "100%"
  const width = props.width ? props.width : "100%"
  const lines = props.lines ? props.lines : 1

  return (
    <ContentLoader
      speed={2}
      viewBox={`0 0 ${width} ${height}`}
      backgroundColor="#f3f3f3"
      foregroundColor="#ecebeb"
      width={width}
      height={height}
      {...props}
    >
      <rect x="0" y="0" rx="3" ry="3" width={width} height={height} />
    </ContentLoader>
  )
}

export default Skeleton
