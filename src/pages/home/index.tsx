import { HomeWrapper, PokemonsWrapper } from './styles';
import {gql} from "@apollo/client";
import PokeCard from "./components/PokeCard";
import useCustomQuery from "../../hooks/useCustomQuery";


type PokemonResponse = {
    pokemons: {
        results: Array<{
            url: string;
            name: string;
            image: string;
        }>
    }
};

const GET_POKEMONS = gql`
    query pokemons($limit: Int, $offset: Int) {
        pokemons(limit: $limit, offset: $offset) {
            results {
                url
                name
                image
            }
        }
    }
`;

const gqlVariables = {
    limit: 30,
    offset: 1,
};


const Home = () => {
    const { data, loading, from } = useCustomQuery<PokemonResponse>(GET_POKEMONS, {
        variables: gqlVariables,
    });
    const pokemons = data?.pokemons?.results ?? [];
    return (
        <HomeWrapper>
            <h1>Poke Offline</h1>
            {loading && <p>Loading...</p>}
            <p>Accessing from: {from}</p>
            <PokemonsWrapper>
                {pokemons.map(pokemon => (
                    <PokeCard img={pokemon.image} name={pokemon.name} />
                ))}
            </PokemonsWrapper>
        </HomeWrapper>
    );
};

export default Home;