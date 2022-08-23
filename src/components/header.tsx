import { Button, Container, Form, FormControl, Nav, Navbar, NavDropdown } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { config } from "../config";


interface Props {
  brainId: string;
  searchText: string;
  handleSearchInput: (
    event: React.FormEvent<HTMLInputElement>
  ) => Promise<void>;
  handleSearchClick: (
    event: React.MouseEvent<HTMLButtonElement>
  ) => Promise<void>;
}

export const Header = ({
  brainId,
  searchText,
  handleSearchInput,
  handleSearchClick
}: Props) => {
  const navigate = useNavigate();
  function navClick(vizId: string) {
    const parts = document.location.pathname.split("/");
    parts[1] = vizId;
    navigate(parts.join("/"));
  }

  let b = config.brains[brainId];

  return (
    <div style={{ background: "white" }} >
      <div className="container">
        <Navbar expand="lg">
          <Container fluid>
            <Navbar.Brand href={b?.homeUrl || "/"}>{b?.name}</Navbar.Brand>
            <Navbar.Toggle aria-controls="offcanvasNavbar" />
            <Navbar.Collapse id="responsive-navbar-nav">
              <Nav className="me-auto">
                {b?.showVisualizations &&
                  <NavDropdown title="Visualizations" id="collasible-nav-dropdown">
                    <NavDropdown.Item onClick={() => navClick("brainish")}>Brainish</NavDropdown.Item>
                    <NavDropdown.Item onClick={() => navClick("brainstorm")}>Brainstorm</NavDropdown.Item>
                    <NavDropdown.Item onClick={() => navClick("memebrane")}>Memebrane</NavDropdown.Item>
                  </NavDropdown>
                }
                {b?.pages.map(p =>
                  <Nav.Link href={p.url}>{p.name}</Nav.Link>

                )}
              </Nav>
              <Form className="d-flex">
                <FormControl
                  value={searchText}
                  onInput={handleSearchInput}
                  type="search"
                  placeholder="Search"
                  className="me-2"
                  aria-label="Search"
                />
                <Button onClick={handleSearchClick} variant="outline-success">Search</Button>
              </Form>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      </div >
    </div>
  );
};
