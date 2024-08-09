import { Routes, Route } from 'react-router-dom';

import Layout from './components/Layout';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import Chat from './components/Chat';
import Missing from './components/Missing';
import RequireAuth from './components/RequireAuth';
import PersistLogin from './components/PersistLogin';

const ROLES = {
  'User': 2121,
  'Admin': 1738
}

function App() {
  return (
    <Routes>
      <Route path='/' element={<Layout />}>

        {/* public routes */}
        <Route path='login' element={<Login />} />
        <Route path='register' element={<Register />} />

        {/* protected frontend routes (authorization) */}
        <Route element={<PersistLogin />}>
          <Route index element={<Home />} /> {/* included for persist */}

          <Route element={<RequireAuth allowedRoles={[ROLES.Admin]} />}>
            <Route path='chat' element={<Chat />} />
          </Route>
        </Route>

        {/* catch all */}
        <Route path='*' element={<Missing />} />

      </Route>
    </Routes>
  );
}

export default App;