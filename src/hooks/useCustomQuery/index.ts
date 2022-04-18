import {get, set} from 'idb-keyval';
import {OperationVariables, QueryHookOptions, useQuery} from '@apollo/client';
import {DocumentNode, QueryResultExtend} from "./interfaces";
import {useEffect, useState, useCallback} from "react";
import hash from 'object-hash';
import {ApolloQueryResult} from "@apollo/client/core/types";
import {useOnline} from "rooks";

const useCustomQuery = <TData, TVariables = OperationVariables>(
    query: DocumentNode,
    options?: QueryHookOptions<TData, TVariables>,
): QueryResultExtend<TData, TVariables> => {
    const result = useQuery<TData, TVariables>(query, options);
    const [resultData, setResultData] = useState<TData>();
    const [finish, setFinish] = useState(false);
    const [privateOptions, setPrivateOptions] = useState(options);
    const [loading, setLoading] = useState(true);
    const [from, setFrom] = useState('network');
    const isOnline = useOnline();

    const handleRefetch = useCallback(async (variables?: Partial<TVariables>): Promise<ApolloQueryResult<TData>> => {
       setFinish(false);
       setLoading(true)
        setPrivateOptions(variables);
       return result.refetch(variables);
    }, [result]);

    useEffect(() => {
        if (result.data !== undefined) {
            setLoading(false);
        }
        if (result.error) {
            setLoading(false);
        }
    },[result.data, result.error]);

   useEffect(() => {
       (async function () {
           if (!loading || !isOnline) {
               const key = hash({privateOptions});
               if (!finish) {
                   if (result.data) {
                       set(key, result.data);
                       setResultData(result.data);
                       setFinish(true);
                       setLoading(false);
                       setFrom('network');
                   } else {
                       const tania = await get(key);
                       setResultData(tania)
                       setFinish(true);
                       setLoading(false);
                       setFrom('cache');
                   }
               }
           }
       }());
    }, [finish, isOnline, loading, options, privateOptions, result.data, result.loading]);

    return {...result, data: resultData, from, refetch: handleRefetch, loading: loading};
};

export default useCustomQuery;