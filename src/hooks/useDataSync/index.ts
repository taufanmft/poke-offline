import {useOnline} from "../useOnline";
import {get, set} from 'idb-keyval';
import {useEffect, useState} from "react";
import {useApolloClient} from "@apollo/client";
import remove from 'lodash/remove';

/**
 * Use this hook anywhere in your page to trigger queued mutation call to server. Returns an object with isOnline boolean.
 * @constructor
 * @param {() => void} onSyncComplete - Function that will be called when the sync is completed.
 * @param onSyncError - Function that will be called if it fails to sync.
 */
const useDataSync = (onSyncComplete: (() => void), onSyncError?: (() => void)) => {
    const [isLocked, setIsLocked] = useState(false);
    const isOnline = useOnline();
    const client = useApolloClient();
    useEffect(() => {
        (async function () {
            if (isOnline && !isLocked) {
                setIsLocked(true);
                const mutationLockStatus = await get('mutation-lock') as Boolean ?? false;
                if (!mutationLockStatus) {
                    await set('mutation-lock', true);
                    const existingQueue = await get('mutation-queue') as Array<any>;
                    if (existingQueue && existingQueue.length > 0) {
                        for (const item of existingQueue) {
                            try {
                                await client.mutate({
                                    mutation: item.mutation,
                                    ...item.options,
                                })
                                remove(existingQueue, {id: item.id})
                                console.log('sending data', item)
                            } catch (e) {
                                console.log('error nih', e)
                                await set('mutation-queue', existingQueue);
                                if (onSyncError) onSyncError();
                                return;
                            }
                        }
                        onSyncComplete();
                    }
                }
                setIsLocked(false);
            }
        })();
    }, [client, isLocked, isOnline, onSyncComplete]);

    return { isOnline: isOnline}
};

export default useDataSync;