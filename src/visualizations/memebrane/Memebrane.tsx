import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { addCrumbData } from "../../data/addCrumbData";
import { iThought } from "../../data/iThought";
import { loadThoughtData } from "../../data/loadThoughtData";
import "./index.scss"

export const Memebrane = ({ setLoading }: { setLoading: React.Dispatch<React.SetStateAction<boolean>> }
) => {
    let { brainId, thoughtId } = useParams();
    const [thought, setThought] = useState({} as iThought);
    const navigate = useNavigate();
    const [crumbs, setCrumbs] = useState([] as iThought[]);


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
                    setCrumbs(await addCrumbData(retrievedThought));
                    // console.log(retrievedThought.raw)
                } catch (e) {
                    console.error(e);
                    alert(e);
                }
                setLoading(false);
            }
        }
        asyncCall();
    }, [thoughtId, brainId, navigate, setLoading]);

    return <div className="memebrane">
        <div className="container">
            <p>Parents: {thought.parents?.map((t) => (<span key={t.id}>
                <Link to={`/memebrane/${brainId}/${t.id}`} >{t.name}</Link>,<> </>
            </span>))}</p>

            <h1>{thought.name}</h1>

            <p>Children: {thought.children?.map((t) => (<span key={t.id}>
                <Link to={`/memebrane/${brainId}/${t.id}`} >{t.name}</Link>,<> </>
            </span>))}</p>

            <p>Jumps: {thought.jumps?.map((t) => (<span key={t.id}>
                <Link to={`/memebrane/${brainId}/${t.id}`} >{t.name}</Link>,<> </>
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
            <hr />
            <p>Breadcrumbs: {crumbs?.map((t) => (<span key={t.id}>
                <Link to={`/memebrane/${brainId}/${t.id}`} >{t.name}</Link>,<> </>
            </span>))}</p>
        </div>
    </div>
};
