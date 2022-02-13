import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
// import { addCrumbData } from "../../data/addCrumbData";
// import { iThought } from "../../data/iThought";
// import { loadThoughtData } from "../../data/loadThoughtData";
import "./index.scss"
import React from "react";
import { ForceGraph } from "./forceGraph";

const data = {
    nodes: [
        {
            "id": "Myriel",
            "group": 1
        },
        {
            "id": "Napoleon",
            "group": 1
        },
        {
            "id": "Mlle.Baptistine",
            "group": 1
        }],
    links: [
        {
            "source": "Napoleon",
            "target": "Myriel",
            "value": 2
        },
        {
            "source": "Mlle.Baptistine",
            "target": "Myriel",
            "value": 2
        }
    ]
}

export const Brainstorm = ({ setLoading }: { setLoading: React.Dispatch<React.SetStateAction<boolean>> }
) => {
    let { brainId, thoughtId } = useParams();
    //const [thought, setThought] = useState({} as iThought);
    const navigate = useNavigate();
    //const [crumbs, setCrumbs] = useState([] as iThought[]);
    const ref = useRef<SVGSVGElement>(null);
    // const ref: RefObject<SVGSVGElement> = React.createRef()

    useEffect(() => {
        //draw()
        if (ref.current) {
            const sim = ForceGraph(data, ref.current, {
                // @ts-ignore
                nodeId: d => d.id,
                // @ts-ignore
                nodeGroup: d => d.group,
                // @ts-ignore
                nodeTitle: d => `${d.id}`,
                // @ts-ignore
                linkStrokeWidth: l => Math.sqrt(l.value),
                // @ts-ignore
                width: 600,
                height: 600//,
                // @ts-ignore
                //invalidation // a promise to stop the simulation when the cell is re-run
            })
        }
    }, [])

    useEffect(() => {
        // const asyncCall = async () => {
        //     if (!brainId) {
        //         navigate("jerry/32f9fc36-6963-9ee0-9b44-a89112919e29");
        //     } else if (!thoughtId) {
        //         navigate(`${brainId}/32f9fc36-6963-9ee0-9b44-a89112919e29`);
        //     } else {
        //         setLoading(true);
        //         try {
        //             const retrievedThought = await loadThoughtData(thoughtId, brainId);
        //             setThought(retrievedThought);
        //             setCrumbs(await addCrumbData(retrievedThought));
        //         } catch (e) {
        //             console.error(e);
        //             alert(e);
        //         }
        //         setLoading(false);
        //     }
        // }
        // asyncCall();
    }, [thoughtId, brainId, navigate, setLoading]);

    return <div className="brainstorm">
        <svg ref={ref} id="d3Svg" width="500" height="500" />
    </div>
};
