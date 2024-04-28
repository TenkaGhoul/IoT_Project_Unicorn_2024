import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './componements/dashboard/dashboard';

import './App.css';

function Main() {

  return (
    <div>
      <Routes>
        <Route path="/" element={<Dashboard />} /> 
        <Route path="*" element="404 Not Found" />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Main />
    </Router>
  );
}
export default App;