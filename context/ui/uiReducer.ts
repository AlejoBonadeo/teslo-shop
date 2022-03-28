import { UiState } from ".";

type Action = | { type: 'toggleMenu'}

export const uiReducer = (state: UiState, action: Action): UiState => {
    switch (action.type) {
        case 'toggleMenu':    
            return {
                ...state,
                isMenuOpen: !state.isMenuOpen
            };
        default:
            return state;
    }
}