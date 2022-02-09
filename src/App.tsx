import './App.scss';
import { Header } from "./header";
import { useState } from 'react';
import { Brainish } from "./components/brainish/brainish";
import { Memebrane } from "./components/memebrane/Memebrane";
import { iViz } from './utils/iViz';
import { BrowserRouter, Link, Navigate,  Route, Routes } from 'react-router-dom';
import About from './components/about/About';
import { Modal } from 'react-bootstrap';

export function App() {
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const handleClose = () => setShowSearchResults(false);
  const parts = document.location.pathname.split("/");
  const vizId = parts[1];
  const brainId = parts[2];


  // ***** Add your visualizations here *****
  const vizs: iViz[] = [
    { name: "Brainish", id: "brainish", element: <Brainish /> },
    { name: "Memebrane", id: "memebrane", element: <Memebrane /> }
  ]
  const [viz, setViz] = useState(vizs[0])

  async function handleSearchInput(event: React.FormEvent<HTMLInputElement>) {
    setSearchText(event.currentTarget.value);
  }

  async function handleSearchClick(event: React.MouseEvent<HTMLButtonElement>) {
    setLoading(true);
    event.preventDefault();
    const apiUrl = `https://memebrane.conversence.com/brain/jerry/search?query=${encodeURI(
      searchText
    )}&lang=simple&notes=on/`;
    fetch(`${apiUrl}`, {
      headers: {
        Accept: "application/json"
      }
    })
      .then((r) => r.json())
      .then((apiData) => {
        setSearchResults(apiData.results);
        setShowSearchResults(true);
        setLoading(false);
      });
  }

  return (
    <div className="fullHeight">
      <BrowserRouter>
        <Header
          searchText={searchText}
          handleSearchInput={handleSearchInput}
          handleSearchClick={handleSearchClick}
        />

        <div className="plugins" style={loading ? { opacity: 0.5 } : {}}>
          <Routes>
            <Route path="about" element={<About />} />
            <Route path="brainish" element={<Brainish />} >
              <Route path=":brainId" element={<Brainish />} >
                <Route path=":thoughtId" element={<Brainish />} />
              </Route>
            </Route>
            <Route path="memebrane" element={<Memebrane />}  >
              <Route path=":brainId" element={<Memebrane />} >
                <Route path=":thoughtId" element={<Memebrane />} />
              </Route>
            </Route>
            <Route path="*" element={<Navigate to="brainish/jerry/32f9fc36-6963-9ee0-9b44-a89112919e29" />} />
          </Routes>
        </div>

        {/* Search */}
        <Modal style={{ color: "black" }} show={showSearchResults} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Search Results</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {Object.entries(searchResults).map(([resultId, value]) => (<div key={resultId}>
              <Link onClick={handleClose} to={`/${vizId}/${brainId}/${resultId}`} >{value}</Link>
            </div>))}
          </Modal.Body>
          <Modal.Footer>
          </Modal.Footer>
        </Modal>
      </BrowserRouter>
      {loading && (
        <div className="main-spinner d-flex justify-content-center align-items-center">
          <div className="spinner-border text-light" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
