import {useOnline} from "../useOnline";
import {get, set} from 'idb-keyval';
import {useEffect} from "react";
import {useApolloClient} from "@apollo/client";
import remove from 'lodash/remove';
const useDataSync = (onSyncComplete: (() => void)) => {
    const isOnline = useOnline();
    const client = useApolloClient();
    useEffect(() => {
        (async function () {
            if (isOnline) {
                const existingQueue = await get('mutation-queue') as Array<any>;
                if (existingQueue && existingQueue.length > 0) {
                    for (const item of existingQueue) {
                        await client.mutate({
                            mutation: item.mutation,
                            ...item.options,
                        })
                        remove(existingQueue, {id: item.id})
                        console.log('sending data', item)
                    }
                    set('mutation-queue', existingQueue);
                    onSyncComplete();
                }
            }
        })();
    }, [client, isOnline, onSyncComplete]);

    return { tasya: 'ok'}
};

export default useDataSync;