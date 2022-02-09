import { iThought } from "../data/iThought";

export interface baseUiComponentProps {
  thought: iThought;
  navToThought: iNavFromAnchor;
  crumbs?: iThought[];
  navToCrumb?: iNavFromAnchor;
}

export type iNavFromAnchor = (
  thoughtId: string,
  event: React.MouseEvent<HTMLAnchorElement>
) => Promise<void>;
