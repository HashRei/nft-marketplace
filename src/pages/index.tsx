import type { NextPage } from 'next'
import { Page } from '../components/Page'
import { Navbar } from '../components/sections/Navbar'

const Home: NextPage = () => {
  return (
    
    <Page>
      <main className="main">
        <Navbar/>
      </main>
    </Page>
  )
}

export default Home
