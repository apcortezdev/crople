import React from 'react';
import { enableScreens } from 'react-native-screens';
import { Provider } from 'react-redux';
import { applyMiddleware, combineReducers, createStore } from 'redux';
import ReduxThunk from 'redux-thunk';
import Startup from './screens/Startup';
import authReducer from './store/auth.reducer';
import cropleReducer from './store/crople.reducer';
import rankReducer from './store/rank.reducer';
import tempsReducer from './store/temps.reducer';
import userReducer from './store/user.reducer';

enableScreens();

const rootReducer = combineReducers({
  user: userReducer,
  game: cropleReducer,
  auth: authReducer,
  rank: rankReducer,
  temps: tempsReducer,
});

const store = createStore(rootReducer, applyMiddleware(ReduxThunk));

export default function App() {
  return (
    <Provider store={store}>
      <Startup />
    </Provider>
  );
}
