import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { addCrumbData } from "../../data/addCrumbData";
import { iThought } from "../../data/iThought";
import { loadThoughtData } from "../../data/loadThoughtData";
import "./index.scss"
import React from "react";
import { ForceGraph } from "./forceGraph";

export const Brainstorm = ({ setLoading }: { setLoading: React.Dispatch<React.SetStateAction<boolean>> }
) => {
    let { brainId, thoughtId } = useParams();
    const navigate = useNavigate();
    const [thought, setThought] = useState({} as iThought);
    const [thoughtIndex, setThoughtIndex] = useState({} as { [key: string]: iThought });
    const [linkIndex, setLinkIndex] = useState({} as { [key: string]: { source: string, target: string } });

    const [crumbs, setCrumbs] = useState([] as iThought[]);
    const [clickLocation, setClickLocation] = useState({ x: 0, y: 0 });

    const ref = useRef<SVGSVGElement>(null);
    const [sim, setSim] = useState<any>();
    //let sim: any
    //const clickLocation = {value:{x:0,y:0}}

    const thoughtClickedFactory = () => {
        const func = (event: any, thoughtData: any) => {
            // setClickLocation({
            //     x: event.target.cx.baseVal.value,
            //     y: event.target.cy.baseVal.value
            // })
            navigate(`/brainstorm/${brainId}/${thoughtData.id}`);
        }
        return func;
    }


    // useEffect(() => {
    //     if (ref.current) {
    //         setSim(ForceGraph(ref.current, thoughtClicked));
    //     }
    // }, [])

    const loadThought = async (newThoughtId: string) => {
        if (brainId) {
            setLoading(true);
            try {
                const retrievedThought = await loadThoughtData(newThoughtId, brainId);
                setThought(retrievedThought);
                //console.log(clickLocation)
                let _sim: any
                if (!sim) {
                    _sim = ForceGraph(ref.current, thoughtClickedFactory())
                    setSim(_sim);
                } else {
                    _sim = sim
                }
                console.log(thoughtIndex)
                // for (const t of Object.values(thoughtIndex)) {
                //     //@ts-ignore
                //     delete t.x;
                //     //@ts-ignore
                //     delete t.y;
                // }
                // add new thoughts to index
                const updatedThoughtIndex = retrievedThought.raw.thoughts.reduce((a: any, t: iThought) => {
                    //@ts-ignore
                    // if (!t.x) {
                    //     //@ts-ignore
                    //     t.x = clickLocation.x;
                    //     //@ts-ignore
                    //     t.y = clickLocation.y
                    // }
                    a[t.id] = t;
                    return a;
                }, thoughtIndex)
                console.log(updatedThoughtIndex)
                setThoughtIndex(updatedThoughtIndex);

                // add new links to index
                const updatedLinkIndex = retrievedThought.raw.links
                    //@ts-ignore
                    .map(l => {
                        return { source: l.thoughtIdA, target: l.thoughtIdB }
                    })
                    .reduce((a: any, l: any) => {
                        a[l.source + l.target] = l;
                        return a;
                    }, linkIndex)
                setLinkIndex(updatedLinkIndex);

                //@ts-ignore
                _sim.update({
                    nodes: Object.values(updatedThoughtIndex),
                    //@ts-ignore
                    links: Object.values(updatedLinkIndex)
                });
                setCrumbs(await addCrumbData(retrievedThought));
            } catch (e) {
                console.error(e);
                alert(e);
            }
            setLoading(false);
        }
    }

    useEffect(() => {
        const asyncCall = async () => {
            if (!brainId) {
                navigate("jerry/32f9fc36-6963-9ee0-9b44-a89112919e29");
            } else if (!thoughtId) {
                navigate(`${brainId}/32f9fc36-6963-9ee0-9b44-a89112919e29`);
            } else {
                loadThought(thoughtId);
            }
        }
        asyncCall();
    }, [thoughtId, brainId, navigate, setLoading]);

    return <div className="brainstorm">
        <svg ref={ref} id="d3Svg" width="100%" height="90vh" >
            {/* <defs>
                <filter x="0" y="0" width="1" height="1" id="bg-text">
                    <feFlood flood-color="#ddd" />
                    <feComposite in="SourceGraphic" operator="xor" />
                </filter>
            </defs> */}
        </svg>
    </div>
};
