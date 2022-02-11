import "./index.scss"
import { iThought } from "../../data/iThought";
import { Thought } from "./thought";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { loadThoughtData } from "../../data/loadThoughtData";
import { addCrumbData } from "../../data/addCrumbData";
import { Attachment } from "../../components/Attachment";

export const Brainish = ({ setLoading }: { setLoading: React.Dispatch<React.SetStateAction<boolean>> }
) => {
  let { brainId, thoughtId } = useParams();
  const [thought, setThought] = useState({} as iThought);
  const [crumbs, setCrumbs] = useState([] as iThought[]);
  const navigate = useNavigate();

  useEffect(() => {
    const asyncCall = async () => {
      if (!brainId) {
        navigate("jerry/32f9fc36-6963-9ee0-9b44-a89112919e29");
      } else if (!thoughtId) {
        navigate(`${brainId}/32f9fc36-6963-9ee0-9b44-a89112919e29`);
      } else {
        setLoading(true);
        const retrievedThought = await loadThoughtData(thoughtId || "");
        setThought(retrievedThought);
        setCrumbs(await addCrumbData(retrievedThought));
        setLoading(false);
      }
    }
    asyncCall();
  }, [thoughtId, brainId, navigate, setLoading]);

  return (
    <div className="mainGrid">
      <div className="parentsArea area">
        <div className="areaLabel">Parents</div>
        {thought.parents?.map((t) => (
          <Thought key={t.id} thought={t} brainId={brainId} />
        ))}
      </div>
      <div className="jumpsArea area">
        <div className="areaLabel">Jumps</div>
        {thought.jumps?.map((t) => (
          <Thought key={t.id} thought={t} brainId={brainId} />
        ))}
      </div>
      <div className="thoughtArea">
        <div className="jumpsLine"></div>
        <div className="parentsLine"></div>
        <div className="childrenLine"></div>
        <div className="siblingsLine"></div>
        <Thought thought={thought} brainId={brainId} />
      </div>
      <div className="childrenArea area">
        <div className="areaLabel">Children</div>
        {thought.children?.map((t) => (
          <Thought key={t.id} thought={t} brainId={brainId} />
        ))}
      </div>
      <div className="siblingsArea area">
        <div className="areaLabel">Siblings</div>
        {thought.siblings?.map((t) => (
          <Thought key={t.id} thought={t} brainId={brainId} />
        ))}
      </div>
      {/* <div className="notesArea">
        {thought.attachments?.map((a) => (
          <Attachment key={a.id} att={a}/>
        ))}
      </div> */}
      <div className="crumbsArea area">
        {crumbs?.map((t) => (
          <Thought key={t.id} thought={t} brainId={brainId} />
        ))}
      </div>
    </div>
  );
};
