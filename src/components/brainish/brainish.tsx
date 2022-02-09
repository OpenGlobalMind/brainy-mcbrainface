import "./index.scss"
import { iThought } from "../../data/iThought";
import { Thought } from "./thought";
import { useParams } from "react-router-dom";
import { navToCrumb } from "../../utils/navToCrumb";
import { useEffect, useState } from "react";
import { loadThoughtData } from "../../data/loadThoughtData";

export const Brainish = (
) => {
  let params = useParams();
  const crumbs = [] as iThought[];
  const [thought, setThought] = useState({} as iThought);


  useEffect(() => {
    const asyncCall = async()=>{
      setThought(await loadThoughtData(params.thoughtId || ""))
    }
    asyncCall();
  }, [params.thoughtId]);
  
  return (
    <div className="mainGrid">
      <div className="parentsArea area">
        {thought.parents?.map((thought) => (
          <Thought key={thought.id} thought={thought} brainId={params.brainId} />
        ))}
      </div>
      <div className="jumpsArea area">
        {thought.jumps?.map((thought) => (
          <Thought key={thought.id} thought={thought} brainId={params.brainId} />
        ))}
      </div>
      <div className="thoughtArea">
        <div className="jumpsLine"></div>
        <div className="parentsLine"></div>
        <div className="childrenLine"></div>
        <Thought thought={thought} brainId={params.brainId} />
      </div>
      <div className="childrenArea area">
        {thought.children?.map((thought) => (
          <Thought key={thought.id} thought={thought} brainId={params.brainId} />
        ))}
      </div>
      <div className="crumbsArea area">
        {crumbs?.map((thought) => (
          <Thought thought={thought} brainId={params.brainId} />
        ))}
      </div>
    </div>
  );
};
