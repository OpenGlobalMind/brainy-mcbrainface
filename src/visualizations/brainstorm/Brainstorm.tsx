import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { addCrumbData } from "../../data/addCrumbData";
import { iThought } from "../../data/iThought";
import { loadThoughtData } from "../../data/loadThoughtData";
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

const data2 = {
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
        },
        {
            "id": "new",
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
        },
        {
            "source": "new",
            "target": "Myriel",
            "value": 2
        }
    ]
}

export const Brainstorm = ({ setLoading }: { setLoading: React.Dispatch<React.SetStateAction<boolean>> }
) => {
    let { brainId, thoughtId } = useParams();
    const navigate = useNavigate();
    const [thought, setThought] = useState({} as iThought);
    const [crumbs, setCrumbs] = useState([] as iThought[]);
    const ref = useRef<SVGSVGElement>(null);
    let sim: any

    useEffect(() => {
        //draw()
        if (ref.current) {
            sim = ForceGraph(ref.current);
            //console.log(sim)
            // sim.update(data)
            // setTimeout(() => {
            //     sim.update(data2);
            // }, 1000);
        }
    }, [])

    useEffect(() => {
        const asyncCall = async () => {
            if (!brainId) {
                navigate("jerry/32f9fc36-6963-9ee0-9b44-a89112919e29");
            } else if (!thoughtId) {
                navigate(`${brainId}/32f9fc36-6963-9ee0-9b44-a89112919e29`);
            } else {
                setLoading(true);
                try {
                    const retrievedThought = await loadThoughtData(thoughtId, brainId);
                    setThought(retrievedThought);
                    console.log(retrievedThought)
                    //@ts-ignore
                    sim.update({nodes: retrievedThought.raw.thoughts ,
                    //@ts-ignore
                    links:retrievedThought.raw.links.map(l=>{return {source:l.thoughtIdA, target:l.thoughtIdB}})});
                    setCrumbs(await addCrumbData(retrievedThought));
                } catch (e) {
                    console.error(e);
                    alert(e);
                }
                setLoading(false);
            }
        }
        asyncCall();
    }, [thoughtId, brainId, navigate, setLoading]);

    return <div className="brainstorm">
        <svg ref={ref} id="d3Svg" width="500" height="500" />
    </div>
};
