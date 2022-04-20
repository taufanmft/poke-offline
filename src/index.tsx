import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import reportWebVitals from './reportWebVitals';
import {
    BrowserRouter,
    Routes,
    Route,
} from "react-router-dom";
import {
    ApolloClient,
    InMemoryCache,
    ApolloProvider,
} from "@apollo/client";
import Tasya from './pages/tasya';
import Home from "./pages/home";
import TodoPage from "./pages/todo";
import NewTodo from './pages/new';

const client = new ApolloClient({
    uri: 'https://graphql-pokeapi.graphcdn.app/',
    cache: new InMemoryCache()
});

const secondClient = new ApolloClient({
    uri: 'https://lanct552d5do5gb2mptuoai4lu.appsync-api.ap-southeast-1.amazonaws.com/graphql',
    cache: new InMemoryCache(),
    headers: {
        'x-api-key': 'da2-rm4mqvietfhulpqbq664yjiifq'
    },
});

ReactDOM.render(
  <React.StrictMode>
      <BrowserRouter>
          <ApolloProvider client={secondClient}>
          <Routes>
              <Route path="/" element={<TodoPage />} />
              <Route path="/tasya" element={<Tasya />} />
              <Route path="/new" element={<NewTodo />} />
          </Routes>
          </ApolloProvider>
      </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.register();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
