import Marketplace from "../components/Marketplace";
import Minter from "../components/Minter";
import { Page } from "../components/Page";

export default function MintMarketplacePage() {
  return (
    <Page>
      <Minter />
      <Marketplace />
    </Page>
  );
}
