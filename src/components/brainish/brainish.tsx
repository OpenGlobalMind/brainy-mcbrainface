import "./index.scss"
import { iThought } from "../../data/iThought";
import { Thought } from "./thought";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { loadThoughtData } from "../../data/loadThoughtData";
import { addCrumbData } from "../../data/addCrumbData";

export const Brainish = ({setLoading}:{setLoading:React.Dispatch<React.SetStateAction<boolean>>}
) => {
  let params = useParams();
  const [thought, setThought] = useState({} as iThought);
  const [crumbs, setCrumbs] = useState([] as iThought[]);

  useEffect(() => {
    const asyncCall = async()=>{
      setLoading(true);
      const retrievedThought = await loadThoughtData(params.thoughtId || "");
      setThought(retrievedThought);
      setCrumbs(await addCrumbData(retrievedThought));
      setLoading(false);
    }
    asyncCall();
  }, [params.thoughtId]);
  
  return (
    <div className="mainGrid">
      <div className="parentsArea area">
        {thought.parents?.map((t) => (
          <Thought key={t.id} thought={t} brainId={params.brainId} />
        ))}
      </div>
      <div className="jumpsArea area">
        {thought.jumps?.map((t) => (
          <Thought key={t.id} thought={t} brainId={params.brainId} />
        ))}
      </div>
      <div className="thoughtArea">
        <div className="jumpsLine"></div>
        <div className="parentsLine"></div>
        <div className="childrenLine"></div>
        <Thought thought={thought} brainId={params.brainId} />
      </div>
      <div className="childrenArea area">
        {thought.children?.map((t) => (
          <Thought key={t.id} thought={t} brainId={params.brainId} />
        ))}
      </div>
      <div className="crumbsArea area">
        {crumbs?.map((t) => (
          <Thought thought={t} brainId={params.brainId} />
        ))}
      </div>
    </div>
  );
};
