import { Link } from "react-router-dom";
import { iThought } from "../../data/iThought";
import linkIcon from "./linkIcon";
interface Props {
  thought: iThought;
  brainId?: string;
}

export const Thought = ({ thought, brainId }: Props) => {
  const url = thought?.attachments?.find((a) => a.location)?.location;

  return (
    <div title={thought.name} key={thought.id} className="thought" style={{ color: thought.color }}>
      {
        thought.thoughtIconInfo?.slice(0, 1) !== "1" && thought.id &&
        <img onError={(i) => { i.currentTarget.style.opacity = '0'; }} className="thoughtIcon" alt="" src={`https://api.thebrain.com/api-v11/brains/${thought.brainId}/thoughts/${thought.id}/icon?maxWidth=200&maxHeight=200&match=false`}></img>
      }
      {
        url && (
          <a
            className="link-icon"
            href={url}
            target="mcBrain"
            rel="noreferrer"
          >
            {linkIcon}
          </a>
        )}
      <Link className="navToThought" to={`/brainish/${brainId}/${thought.id}`} >{thought.name}</Link>
    </div>
  );
};
