import {OperationVariables, useMutation} from "@apollo/client";
import {DocumentNode} from "graphql";
import {TypedDocumentNode} from "@graphql-typed-document-node/core";
import {MutationFunctionOptions, MutationHookOptions, MutationTuple} from "@apollo/client/react/types/types";
import {useOnline} from "../useOnline";
import {useCallback} from "react";
import {get, set} from 'idb-keyval';


const useCustomMutation =
    <TData = any,
        TVariables = OperationVariables,
        >(mutation: DocumentNode | TypedDocumentNode<TData, TVariables>,
          options?: MutationHookOptions<TData, TVariables>): MutationTuple<TData, TVariables> => {
    const [mutationFunction, mutationResult] = useMutation<TData, TVariables>(mutation, options);
    const isOnline = useOnline();

    const handleMutation = useCallback(async (options?: MutationFunctionOptions<TData, TVariables>) => {

        if (isOnline) {
            console.log('[mutation] ini online')
            mutationFunction(options);
        } else {
            console.log('[mutation] offline. writing to queue')
            const existingQueue = await get('mutation-queue') as Array<any>;
            existingQueue.forEach(val => console.log('the val', val))
            if (existingQueue) {
                set('mutation-queue', [
                    ...existingQueue,
                    {
                    options: options,
                    mutation: mutation,
                }]);
            } else {
                set('mutation-queue', [
                    {
                        options: options,
                        mutation: mutation,
                    }]);
            }

        }

        return {
            data: undefined,
            extensions: undefined,
            context: undefined,
        }

    }, [isOnline, mutation, mutationFunction]);


    return [handleMutation, mutationResult]
};

export default useCustomMutation;