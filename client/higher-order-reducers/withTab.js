// remember to specify tab in initial state of the base reducer
export default ({ context, reduce }) => (state, action) => {
  switch (action.type) {
    case `${context}.TAB_SWITCHED`:
      return { ...state, tab: action.tab };
    default:
      return reduce(state, action);
  }
};
