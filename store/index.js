import Vuex from 'vuex'

const createStore = () => {
    return new Vuex.Store({
        state: {
            imgCountSpinner: 0,
        },
        mutations: {
            updateImgCountSpinner(state) {
                state.imgCountSpinner++;
            }
        },
        getters: {
            imgCountSpinner(state) {
                return state.imgCountSpinner;
            }
        },
    })
}

export default createStore;