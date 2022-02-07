import { iThought } from "../../data/iThought";
import linkIcon from "./linkIcon";
interface Props {
  thought: iThought;
  navToThought: (
    thoughtId: string,
    event: React.MouseEvent<HTMLAnchorElement>
  ) => Promise<void>;
}

export const Thought = ({ thought, navToThought }: Props) => {
  return (
    <div className="thought" style={{ color: thought.color }}>
      {thought.url && (
        <a
          className="link-icon"
          href={thought.url}
          target="_blank"
          rel="noreferrer"
        >
          {linkIcon}
        </a>
      )}
      <a
        className="navToThought"
        onClick={(e) => navToThought(thought.id, e)}
        href={"/" + thought.id}
      >
        {thought.name}
      </a>
    </div>
  );
};
