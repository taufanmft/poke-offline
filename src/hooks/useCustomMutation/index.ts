import {OperationVariables, useMutation} from "@apollo/client";
import {DocumentNode} from "graphql";
import {TypedDocumentNode} from "@graphql-typed-document-node/core";
import {MutationFunctionOptions, MutationHookOptions, MutationTuple} from "@apollo/client/react/types/types";
import {useOnline} from "../useOnline";
import {useCallback} from "react";
import { v4 as uuidv4 } from 'uuid';
import {get, set} from 'idb-keyval';
import setArray from 'lodash/set';
import getArray from 'lodash/get';
type DataMutateOptions = {
    arrayPath: string;
    optimisticResponse: Record<string, unknown>;
}

/**
 * Like Apollo's useMutation but with offline queue capabilities. Will pass through your mutation if online and write to mutation-queue if offline.
 * @constructor
 * @param mutation - Your mutation graphql file.
 * @param options - The usual Apollo useMutation options.
 * @param hash - The hash of the query that you want to modify. Leave blank if you didn't want to modify anything.
 */

const useCustomMutation =
    <TData = any,
        TVariables = OperationVariables,
        >(mutation: DocumentNode | TypedDocumentNode<TData, TVariables>,
          options?: MutationHookOptions<TData, TVariables>,
          hash?: string,
          ): MutationTuple<TData, TVariables> => {
    const [mutationFunction, mutationResult] = useMutation<TData, TVariables>(mutation, options);
    const isOnline = useOnline();

    const handleMutation = useCallback(async (options?: MutationFunctionOptions<TData, TVariables>, dataOptions?: DataMutateOptions) => {

        if (isOnline) {
            console.log('[mutation] ini online')
            return mutationFunction(options);
        } else {
            console.log('[mutation] offline. writing to queue')
            const existingQueue = await get('mutation-queue') as Array<any>;
            if (existingQueue) {
                set('mutation-queue', [
                    ...existingQueue,
                    {
                    options: options,
                    mutation: mutation,
                    id: uuidv4(),
                }]);
            } else {
                set('mutation-queue', [
                    {
                        options: options,
                        mutation: mutation,
                        id: uuidv4(),
                    }]);
            }
            console.log('[mutation] data options is present:', Boolean(dataOptions), 'hash:', hash);
            if (dataOptions) {
                if (hash) {
                    const existingData = await get(hash);
                    const theArray = getArray(existingData, dataOptions.arrayPath);
                    theArray.push(dataOptions.optimisticResponse);
                    setArray(existingData, dataOptions.arrayPath, theArray);
                    set(hash, existingData);
                }
            }

        }

        return {
            data: undefined,
            extensions: undefined,
            context: undefined,
        }

    }, [hash, isOnline, mutation, mutationFunction]);


    return [handleMutation, mutationResult]
};

export default useCustomMutation;