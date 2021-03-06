import React from "react"

import Document, {
  Html,
  Head,
  Main,
  NextScript,
  DocumentContext,
} from "next/document"

class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await Document.getInitialProps(ctx)
    return { ...initialProps }
  }

  render() {
    return (
      <Html>
        <Head>
          <link
            href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;1,200;1,300;1,400;1,500;1,600;1,700&display=swap"
            rel="stylesheet"
          />
          <link
            rel="apple-touch-icon"
            sizes="180x180"
            href="/apple-touch-icon.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="32x32"
            href="/favicon-32x32.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="16x16"
            href="/favicon-16x16.png"
          />
          <link rel="manifest" href="/site.webmanifest" />
          <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#be1f3d" />
          <meta name="msapplication-TileColor" content="#be1f3d" />
          <meta name="theme-color" content="#be1f3d" />
          <meta
            name="keywords"
            content="renaissancedao, renaissance, art, dao"
          />
          <meta name="application-name" content="renaissancedao.finance" />
          {/* <meta property="og:image" content="/renaissancedao_background.png" /> */}
        </Head>
        <body className="bg-scheme-bg">
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument
