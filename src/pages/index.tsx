import type { NextPage } from "next";
import Carousel from "../components/Carousel";
import { Page } from "../components/Page";

const Home: NextPage = () => {
  return (
    <Page>
      <Carousel/>
    </Page>
  );
};

export default Home;
