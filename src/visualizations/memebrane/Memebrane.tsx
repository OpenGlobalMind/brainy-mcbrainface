import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { iThought } from "../../data/iThought";
import { loadThoughtData } from "../../data/loadThoughtData";
import { baseUiComponentProps as props } from "../../utils/baseUiComponentProps";
import "./index.scss"

export const Memebrane = () => {
    let params = useParams();
    const [thought, setThought] = useState({} as iThought);


    useEffect(() => {
        const asyncCall = async () => {
            setThought(await loadThoughtData(params.thoughtId || ""))
        }
        asyncCall();
    }, [params.thoughtId]);

    return <div className="memebrane">
        <div className="container">
            <p>Parents: {thought.parents?.map((t) => (<span key={t.id}>
                <Link to={`/brainish/${params.brainId}/${t.id}`} >{t.name}</Link>,<> </>
            </span>))}</p>

            <h1>{thought.name}</h1>

            <p>Children: {thought.children?.map((t) => (<span key={t.id}>
                <Link to={`/brainish/${params.brainId}/${t.id}`} >{t.name}</Link>,<> </>
            </span>))}</p>

            <p>Jumps: {thought.jumps?.map((t) => (<span key={t.id}>
                <Link to={`/brainish/${params.brainId}/${t.id}`} >{t.name}</Link>,<> </>
            </span>))}</p>

            <p>Notes: <i>not implemented yet</i></p>

            <p>Attachments: </p>
            {thought.attachments?.map((a) => (
                a.type === "ExternalUrl" ?
                    <div key={a.id} style={{ margin: "1em 0 1em 2.5em" }}>
                        <div><b>{a.name}</b> (ExternalUrl)</div>
                        <a href={a.location} target="_blank" rel="noreferrer">{a.location}</a>
                    </div>
                    :
                    <div key={a.id} style={{ margin: "1em 0 1em 2.5em" }}>
                        <pre>{JSON.stringify(a, undefined, 2)}</pre>
                    </div>
            ))}
        </div>
    </div>
};

const getThoughtUrl = (thought: iThought) => {
    return `/${thought.id}`;
}
