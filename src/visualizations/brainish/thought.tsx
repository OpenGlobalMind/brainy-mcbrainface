import { Link, NavLink, useParams } from "react-router-dom";
import { iThought } from "../../data/iThought";
import linkIcon from "./linkIcon";
interface Props {
  thought: iThought;
  brainId?: string;
}

export const Thought = ({ thought, brainId }: Props) => {
  return (
    <div title={thought.name} key={thought.id} className="thought" style={{ color: thought.color }}>
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
      <Link className="navToThought" to={`/brainish/${brainId}/${thought.id}`} >{thought.name}</Link>
    </div>
  );
};
