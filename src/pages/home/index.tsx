import { HomeWrapper, PokemonsWrapper } from './styles';
import {gql, useQuery} from "@apollo/client";
import PokeCard from "./components/PokeCard";

const GET_POKEMONS = gql`
    query pokemons($limit: Int, $offset: Int) {
        pokemons(limit: $limit, offset: $offset) {
            count
            next
            previous
            status
            message
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
    const { data } = useQuery(GET_POKEMONS, {
        variables: gqlVariables,
    });
    const pokemons = data?.pokemons?.results as Array<Pokemon> ?? [];
    return (
        <HomeWrapper>
            <h1>Poke Offline</h1>
            <PokemonsWrapper>
                {pokemons.map(pokemon => (
                    <PokeCard img={pokemon.image} name={pokemon.name} />
                ))}
            </PokemonsWrapper>
        </HomeWrapper>
    );
};

export default Home;