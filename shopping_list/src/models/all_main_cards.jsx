import MainCard from "./main_card";

const BestSellers = () => {
    return <MainCard query={`games?sort=metacritic`} title={"Best Sellers"} />
}

const BestGamesOfAllTime = () => {
    return <MainCard query={`games?sort=release_date`} title={"Best Games of All Time"} />
}

const BestGamesOfTheYear = () => {
    const today = new Date();
    const yearStart = new Date(today.getFullYear(), 0, 1);
    return <MainCard query={`games?dates=${yearStart.toISOString().split('T')[0]},${today.toISOString().split('T')[0]}&ordering=-added`} title={"Best Games of the Year"} />
}

const Last30Days = () => {
    const today = new Date();

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(today.getDate() - 90);

    return <MainCard query={`games?dates=${thirtyDaysAgo.toISOString().split('T')[0]},${today.toISOString().split('T')[0]}`} title={"Games Recently Released"} />
}

const Next30Days = () => {
    const today = new Date();

    const thirtyDaysAftter = new Date();
    thirtyDaysAftter.setDate(today.getDate() + 30);

    return <MainCard query={`games?dates=${today.toISOString().split('T')[0]},${thirtyDaysAftter.toISOString().split('T')[0]}`} title={"Games Coming In Next Month"} />
}

export { Last30Days, Next30Days, BestGamesOfTheYear, BestGamesOfAllTime, BestSellers };