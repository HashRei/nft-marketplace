import Head from 'next/head'
import React, { ReactNode } from 'react'

interface PageProps {
  children: ReactNode
}

export function Page({ children }: PageProps) {
  return (
    <div>
      <Head>
        <title>LooksSea | NFTMarketplace</title>
        <meta name="description" content="LooksSea - NFTMarketplace" />
        <link rel="icon" href="/Logo_LooksSea.png"/>
      </Head>
      {children}
    </div>
  )
}
