import {get, set} from 'idb-keyval';
import {OperationVariables, QueryHookOptions, useQuery} from '@apollo/client';
import {DocumentNode, QueryResultExtend} from "./interfaces";
import {useEffect, useState, useCallback, useMemo} from "react";
import hash from 'object-hash';
import {ApolloQueryResult} from "@apollo/client/core/types";
import {useOnline} from "../useOnline";

const useCustomQuery = <TData, TVariables = OperationVariables>(
    query: DocumentNode,
    queryName: string,
    options?: QueryHookOptions<TData, TVariables>,
): QueryResultExtend<TData, TVariables> => {
    const result = useQuery<TData, TVariables>(query, options);
    const [resultData, setResultData] = useState<TData>();
    const [finish, setFinish] = useState(false);
    const [privateOptions, setPrivateOptions] = useState(options);
    const [loading, setLoading] = useState(true);
    const [from, setFrom] = useState('network');
    const isOnline = useOnline();
    const pHash = useMemo(() => hash({privateOptions, queryName: queryName}), [privateOptions, queryName]);
    const handleRefetch = useCallback(async (variables?: Partial<TVariables>): Promise<ApolloQueryResult<TData>> => {
       setFinish(false);
       setLoading(true)
        setPrivateOptions(variables);
       return result.refetch(variables);
    }, [result]);

    useEffect(() => {
        if (result.data !== undefined) {
            console.log('the data is changing')
            setResultData(result.data);
            setLoading(false);
        }
        if (result.error) {
            setLoading(false);
        }
    },[result.data, result.error]);

   useEffect(() => {
       (async function () {
           if (!loading || !isOnline) {
               const key = pHash;
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
    }, [finish, isOnline, loading, options, pHash, privateOptions, result.data, result.loading]);

    return {...result, data: resultData, from, refetch: handleRefetch, loading: loading, hash: pHash};
};

export default useCustomQuery;