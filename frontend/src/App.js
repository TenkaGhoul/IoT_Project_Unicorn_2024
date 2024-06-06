import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './componements/dashboard/dashboard';
import Settings from './componements/settings/settings';
import NotFound from './componements/notFound/notFound';

import './App.css';

function Main() {

  return (
    <div>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="*" element={<NotFound />} />
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