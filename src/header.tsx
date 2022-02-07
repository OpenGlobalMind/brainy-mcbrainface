interface Props {
  searchText: string;
  handleSearchInput: (
    event: React.FormEvent<HTMLInputElement>
  ) => Promise<void>;
  handleSearchClick: (
    event: React.MouseEvent<HTMLButtonElement>
  ) => Promise<void>;
}

export const Header = ({
  searchText,
  handleSearchInput,
  handleSearchClick
}: Props) => {
  return (
    <div style={{ backgroundColor: "white" }}>
      <div className="container">
        <nav className="navbar navbar-expand-lg navbar-light">
          <div className="container-fluid">
            <span className="navbar-brand">Jerry's Brain</span>
            <ul className="navbar-nav me-auto mb-2 mb-lg-0"></ul>
            <form className="d-flex">
              <input
                value={searchText}
                onInput={handleSearchInput}
                className="form-control me-2"
                type="search"
                placeholder="search text..."
                aria-label="Search"
              />
              <button
                onClick={handleSearchClick}
                className="btn btn-outline-secondary btn-sm"
                type="submit"
              >
                Search
              </button>
            </form>
          </div>
        </nav>
      </div>
    </div>
  );
};
