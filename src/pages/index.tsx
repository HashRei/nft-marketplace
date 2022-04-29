import type { NextPage } from "next";
import { Page } from "../components/Page";
import { Navbar } from "../components/sections/Navbar";

const Home: NextPage = () => {
  return (
    <Page>
      <Navbar />
    </Page>
  );
};

export default Home;
