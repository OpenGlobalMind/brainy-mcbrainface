import { iThought } from "../../data/iThought";
import { Thought } from "./thought";

interface Props {
  mainThought: iThought;
  navToThought: (
    thoughtId: string,
    event: React.MouseEvent<HTMLAnchorElement>
  ) => Promise<void>;
  crumbs: iThought[];
  navToCrumb: (
    thoughtId: string,
    event: React.MouseEvent<HTMLAnchorElement>
  ) => Promise<void>;
}

export const Brainish = ({
  mainThought,
  navToThought,
  crumbs,
  navToCrumb
}: Props) => {
  return (
    <div className="mainGrid">
      <div className="parentsArea area">
        {mainThought.parents?.map((thought) => (
          <Thought thought={thought} navToThought={navToThought} />
        ))}
      </div>
      <div className="jumpsArea area">
        {mainThought.jumps?.map((thought) => (
          <Thought thought={thought} navToThought={navToThought} />
        ))}
      </div>
      <div className="thoughtArea">
        <div className="jumpsLine"></div>
        <div className="parentsLine"></div>
        <div className="childrenLine"></div>
        <Thought thought={mainThought} navToThought={navToThought} />
      </div>
      <div className="childrenArea area">
        {mainThought.children?.map((thought) => (
          <Thought thought={thought} navToThought={navToThought} />
        ))}
      </div>
      <div className="crumbsArea area">
        {crumbs?.map((thought) => (
          <Thought thought={thought} navToThought={navToCrumb} />
        ))}
      </div>
    </div>
  );
};
