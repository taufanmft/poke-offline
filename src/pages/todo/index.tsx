import { HomeWrapper} from "./styles";
import {useQuery} from "@apollo/client";
import { loader } from 'graphql.macro';
import useCustomQuery from "../../hooks/useCustomQuery";
import {useNavigate} from "react-router-dom";
import useDataSync from "../../hooks/useDataSync";
import {useCallback} from "react";
const GetTodos = loader('./queries/get-todos.graphql');

type TodosResponse = {
    listToDos: {
        items: Array<{
            description: string;
            id: string;
            title: string;
        }>
    }
};

const TodoPage = () => {
    const { data, hash, refetch } = useCustomQuery<TodosResponse>(GetTodos, 'GetTodos');
    const navigate = useNavigate();
    const handleRefetch = useCallback(() => {
        console.log('sudah online. refetching')
        refetch();
    }, [refetch]);
    const { tasya } = useDataSync(handleRefetch);
    return (
        <HomeWrapper>
            <h1>Todo List Gan</h1>
            <button onClick={() => navigate('/new', { state: {hash: hash}})}>Create New Todo</button>
            {data?.listToDos?.items?.map(todo => (
                <div style={{margin: '4px', border: 'solid', padding: '4px'}}>
                <h2>{todo.title}</h2>
                    <p>{todo.description}</p>
                </div>
            ))}
        </HomeWrapper>
    );
};

export default TodoPage;