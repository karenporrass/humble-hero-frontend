import axios from "axios";

const API_URL = "http://localhost:3000/superheroes";

export const getSuperheroes = async () => {
    const response = await axios.get(API_URL);
    return response.data;
};

export const addSuperhero = async (hero: { name: string; superpower: string; humilityScore: number }) => {
    const response = await axios.post(API_URL, hero);
    return response.data;
};
