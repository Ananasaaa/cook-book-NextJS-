import { Suspense } from "react";
import Cards from "./components/cards/Cards";
import Banner from "./components/home/Banner";
import HeroSearch from "./components/home/HeroSearch";

export default function Home() {
  return (
    <>
      <Suspense fallback={null}>
        <HeroSearch />
      </Suspense>
      <Banner />
      <Cards />
    </>
  );
}
