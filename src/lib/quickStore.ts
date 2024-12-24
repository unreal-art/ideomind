import { writable } from "svelte/store";

// Define the initial state
const initialState: {
    isGeneratingFiles: boolean;
} = {
    isGeneratingFiles: false
};

const createQuickStore = () => {
    const { subscribe, set, update } = writable(initialState);

    return {
        subscribe,

        initialize: () => {
            set({
                isGeneratingFiles: false
            });
        },

        updateLoader: (status: boolean) => {
            update((state) => ({
                ...state,
                isGeneratingFiles: status
            }));
        },

        getState: () => {
            let state: typeof initialState;
            subscribe(($store) => {
                state = $store;
            })();
            //@ts-ignore
            return state;
        },

        reset: () => set(initialState)
    };
};

export const quickStore = createQuickStore();
