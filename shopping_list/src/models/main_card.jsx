import Card from './card'
import { getGames } from './fetch'
import { useState, useEffect } from 'react';
import './styles.css'
import { SkeletonCard } from './skeletonCard';

const combine = (a, b) => {
    const existingIds = new Set(a.map(item => item.id));
    const uniqueNewItems = b.filter(item => !existingIds.has(item.id));
    return [...a, ...uniqueNewItems];
}

const MainCard = ({ query, title }) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isDisabled, setDisabled] = useState(false);
    const [page, setPage] = useState(1);
    const [loadingMore, setLoadingMore] = useState(false);

    useEffect(() => {
        const getData = async () => {
            if (page == 1) setLoading(true);
            else setLoadingMore(true);

            const newData = await getGames(query, page);

            if (newData.length === 0) {
                setDisabled(true);
                setLoadingMore(false);
                setLoading(false);
                return;
            }
            else setData(prev => (page === 1 ? newData : combine(prev, newData)));

            setLoading(false);
            setLoadingMore(false);
            setDisabled(false);
        };

        getData();
    }, [query, page]);

    // Show skeleton only on initial load or query change
    if (loading && data.length === 0) {
        return (
            <div className="main-container">
                <h1 className="section-title">{title}</h1>
                <div className="game-grid">
                    {[...Array(20)].map((_, i) => <SkeletonCard key={i} />)}
                </div>
            </div>
        );
    }
    

    return (
        <div className="main-container">
            <h1 className="section-title">{title}</h1>
            <div className="game-grid">
                {data.map((element) => (
                    <Card key={element.id} data={element}  />
                ))}

                {loadingMore && [...Array(20)].map((_, i) => <SkeletonCard key={i} />) }
            </div>

            {data.length > 0 && (
                <div className="load-more-container">
                    <button 
                        className="load-more-btn" 
                        onClick={() => {
                            setPage(prev => prev + 1);
                            setDisabled(true);
                        }}
                        disabled={isDisabled}
                    >
                        {isDisabled ? 'No More Games' : 'Load More'}
                    </button>
                </div>
            )}      
        </div>
    );
}

export default MainCard;