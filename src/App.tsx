import './App.css';
import { Header } from "./header";
import { iThought } from "./data/iThought";
import { loadThoughtData } from "./data/loadThoughtData";
import { Brainish } from "./components/brainish/brainish";
import { addCrumbData } from "./data/addCrumbData";
import { navToCrumb } from "./utils/navToCrumb";
import { useEffect, useState } from 'react';


export function App() {
  const [loading, setLoading] = useState(true);
  const [currentThought, setCurrentThought] = useState({} as iThought);
  const [searchText, setSearchText] = useState("");
  const [crumbs, setCrumbs] = useState([] as iThought[]);

  async function loadThought(thoughtId: string) {
    setLoading(true);
    const thought = await loadThoughtData(thoughtId);
    const _crumbs = await addCrumbData(thought);
    setCurrentThought(thought);
    setCrumbs(_crumbs);
    setLoading(false);
  }

  async function navByWindowLocation() {
    let thoughtId = window.location.pathname.split("/")[1];
    if (thoughtId === "") thoughtId = "32f9fc36-6963-9ee0-9b44-a89112919e29";
    loadThought(thoughtId);
  }

  useEffect(() => {
    window.addEventListener("popstate", navByWindowLocation);
    navByWindowLocation();
    return () => {
      window.removeEventListener("popstate", navByWindowLocation);
    };
  }, []);

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
        const parents: iThought[] = [];
        for (const [key, value] of Object.entries(apiData.results)) {
          parents.push({ id: key, name: value } as iThought);
        }

        setCurrentThought({
          name: "",
          id: "",
          url: "",
          children: [],
          parents: parents,
          siblings: [],
          jumps: [],
          attachments: []
        });
        setLoading(false);
      });
  }

  async function navToThought(
    thoughtId: string,
    event: React.MouseEvent<HTMLAnchorElement>
  ) {
    if (event) {
      event.preventDefault();
    }

    await loadThought(thoughtId);
    window.history.pushState(thoughtId, "", `/${thoughtId}`);
  }

  return (
    <div className="fullHeight">
      <Header
        searchText={searchText}
        handleSearchInput={handleSearchInput}
        handleSearchClick={handleSearchClick}
      />

      <div className="plugins" style={loading ? { opacity: 0.5 } : {}}>
        {/* Add your plugins here */}
        <Brainish
          mainThought={currentThought}
          navToThought={navToThought}
          crumbs={crumbs}
          navToCrumb={navToCrumb}
        />
        {/* End plugins area */}
      </div>
      {!loading && (
        <div className="main-spinner d-flex justify-content-center align-items-center">
        <div className="spinner-border text-light" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
        // <div className="spinner-border main-spinner text-light" role="status">
        //   <span className="visually-hidden">Loading...</span>
        // </div>
      )}
    </div>
  );
}

export default App;
