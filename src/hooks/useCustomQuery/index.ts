import {get, set} from 'idb-keyval';
import {OperationVariables, QueryHookOptions, useQuery} from '@apollo/client';
import {DocumentNode, QueryResultExtend} from "./interfaces";
import {useEffect, useState} from "react";
import hash from 'object-hash';

const useCustomQuery = <TData, TVariables = OperationVariables>(
    query: DocumentNode,
    options?: QueryHookOptions<TData, TVariables>,
): QueryResultExtend<TData, TVariables> => {
    console.log('the options', options, 'the query', query)
    const result = useQuery<TData, TVariables>(query, options);
    const [farin, setFarin] = useState<TData>();
    console.log('error', result.error)

   useEffect(() => {
       (async function () {
           if (!result.loading) {
               const key = hash({options});

               if (result.data) {
                   set(key, result.data);
                   console.log('tasya', result.data)
                   setFarin(result.data);
               } else {
                   const tania = await get(key);
                   setFarin(tania)
               }
           }
       }());
    }, [options, result.data, result.loading]);

    return {...result, status: 'ok', data: farin};
};

export default useCustomQuery;