//import { useQuery } from '@tanstack/react-query';

const API_KEY = import.meta.env.VITE_RAWG_API_KEY
const base_url = import.meta.env.VITE_BASE_URL;

const fetchData = async (query, page=1) => {
    const response = await fetch(`${base_url}/${query}&key=${API_KEY}&page=${page}`)
    console.log(`${base_url}/${query}&key=${API_KEY}&page=${page}`);    
    const data = await response.json();

    return data;
};

const getGames = async (query, page=1) => {
    const data = await fetchData(query, page);

    const games = []
    const gameData = data['results'] || [];

    for (let i = 0; i < gameData.length; i++) {
        if (!gameData[i]['background_image']) continue;

        const item = {
            'id': gameData[i]['id'],
            'name': gameData[i]['name'],
            'image_url': gameData[i]['background_image'],
            'released': gameData[i]['released'],
            'platforms': gameData[i]['parent_platforms']?.map(element => element['platform']['slug']),
        }
        games.push(item);
    } 

    return games;
}

const getGame = async (id, platforms) => {
    const response = await fetch(`${base_url}/games/${id}?key=${API_KEY}`)
    const data = await response.json()
    const gameData = {}

    gameData['name'] = data['name'];
    gameData['description'] = data['description_raw'];
    gameData['released'] = data['released'];
    gameData['platforms'] = platforms;
    gameData['images'] = [data['background_image'], data['background_image_additional']];
    gameData['developers'] = data['developers'][0]['name'];
    gameData['genres'] = data['genres']?.map(element => element['name']);
    

    return gameData;
}

export { fetchData, getGames, getGame };