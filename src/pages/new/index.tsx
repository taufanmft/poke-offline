// @ts-nocheck
import { HomeWrapper } from "./styles";
import useCustomMutation from "../../hooks/useCustomMutation";
import {loader} from "graphql.macro";
import {useLocation} from "react-router-dom";
const CreateTodo = loader('./mutations/create-todo.graphql');

const NewTodo = () => {
    const location = useLocation();
    const [sendTodo, {data}] = useCustomMutation(CreateTodo);
    console.log('location', location.state)
    return (
        <HomeWrapper>
            <form onSubmit={(e) => {
                e.preventDefault()
                // @ts-ignore
                console.log('tasya', e.target[0].value);
                sendTodo({
                    variables: {
                            title: e.target[0].value,
                            description: e.target[1].value
                    }
                });
                window.alert('sudah dikirim/add to queue');

            }}>
                <label>Todo Title</label>
                <br />
                <input
                    name='title'
                    type='text'
                />
                <br/>
                <label>Description</label>
                <br />
                <input
                    name='description'
                    type='text'
                />
                <br />
                <input
                    className='submitButton'
                    type='submit'
                    value='Log Chore'
                />
            </form>
        </HomeWrapper>
    );
};
export default NewTodo;