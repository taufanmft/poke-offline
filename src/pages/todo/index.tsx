import { HomeWrapper} from "./styles";
import {useQuery} from "@apollo/client";
import { loader } from 'graphql.macro';
import useCustomQuery from "../../hooks/useCustomQuery";
import {useNavigate} from "react-router-dom";
const GetTodos = loader('./queries/get-todos.graphql');

type TodosResponse = {
    listTodoLists: {
        items: Array<{
            description: string;
            id: string;
            title: string;
        }>
    }
};

const TodoPage = () => {
    const { data, hash } = useCustomQuery<TodosResponse>(GetTodos, 'GetTodos');
    const navigate = useNavigate();
    return (
        <HomeWrapper>
            <h1>Todo List Gan</h1>
            <button onClick={() => navigate('/new', { state: {hash: hash}})}>Create New Todo</button>
            {data?.listTodoLists.items.map(todo => (
                <div style={{margin: '4px', border: 'solid', padding: '4px'}}>
                <h2>{todo.title}</h2>
                    <p>{todo.description}</p>
                </div>
            ))}
        </HomeWrapper>
    );
};

export default TodoPage;