import { useErrorLog } from '../features';
import { Header } from '../widgets/header/header';

function App() {
  useErrorLog();

  return (
    <div className="main-container">
      <Header />
      <main id="react-content" className="react-content"></main>
    </div>
  );
}

export default App;
