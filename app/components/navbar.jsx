// Site header (server wrapper): reads category navigation data from the
// server-side catalogue and hands plain props to the interactive header.
import Header from "./shop/Header";
import { getNavCategories } from "../products/data/catalog.server";

export default function Navbar() {
  return <Header categories={getNavCategories()} />;
}
