

import React from 'react';
import { MyRoutes } from './src/routes/routes';
import { store } from './src/screens/store/store';
import { Provider } from 'react-redux';
import { UserProvider } from './src/functions/usercontext';
import { PaperProvider } from 'react-native-paper';


function App() {

  return (
    <Provider store={store}>
      <PaperProvider>
        <UserProvider>
          <MyRoutes />
        </UserProvider>
      </PaperProvider>
    </Provider>

  );
}

export default App;
