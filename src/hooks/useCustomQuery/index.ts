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
    const [finish, setFinish] = useState(false);
    //debug state
    const [from, setFrom] = useState('network');
   useEffect(() => {
       (async function () {
           if (!result.loading) {
               const key = hash({options});
               if (!finish) {
                   if (result.data) {
                       set(key, result.data);
                       console.log('tasya', result.data)
                       setFarin(result.data);
                       setFinish(true);
                       setFrom('network');
                   } else {
                       const tania = await get(key);
                       setFarin(tania)
                       setFinish(true);
                       setFrom('cache');
                   }
               }
           }
       }());
    }, [finish, options, result.data, result.loading]);

    return {...result, data: farin, from};
};

export default useCustomQuery;