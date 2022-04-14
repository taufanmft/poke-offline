import { Card } from "./styles";

type PokeCardProps = {
    img: string;
    name: string;
}
const PokeCard = ({img, name}: PokeCardProps) => {
    return(
        <Card>
            <img src={img} />
            <p>{name}</p>
        </Card>
    );
};

export default PokeCard;