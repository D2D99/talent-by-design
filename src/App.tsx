import { Route, Routes } from 'react-router-dom';
// import Login from './screens/login';
import Home from './screens/landing';

function App() {

  return (
    <>
      <Routes>
        {/* <Route path='*' element={<Login />}></Route> */}
        {/* <Route path='/' element={<Header />}></Route> */}
        <Route path='/' element={<Home />}></Route>
        
      </Routes>
    </>
  )
}

export default App;
