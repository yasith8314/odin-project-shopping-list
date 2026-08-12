import MainCard from "./main_card";

// Map to FreeToGame parameters:
// - "sort-by" instead of "sort"
// - Use categories to differentiate sections

const BestSellers = () => {
  // Popularity as a proxy for "best sellers"
  return (
    <MainCard
      query="games?category=mmorpg&sort-by=popularity"
      title={"Best Sellers"}
    />
  );
};

const BestGamesOfAllTime = () => {
  // Newest releases first, using a broad category
  return (
    <MainCard
      query="games?sort-by=popularity"
      title={"Best Games of All Time"}
    />
  );
};

const BestGamesOfTheYear = () => {
  // Use a different category and sort by release date
  return (
    <MainCard
      query="games?sort-by=release-date"
      title={"Best Games of the Year"}
    />
  );
};

export { BestGamesOfTheYear, BestGamesOfAllTime, BestSellers };
