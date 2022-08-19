

interface Props {
  att: any;
}

window.onerror = function (msg, url, linenumber) {
  alert('Error message: ' + msg + '\nURL: ' + url + '\nLine Number: ' + linenumber);
  return true;
}

export const Attachment = ({ att }: Props) => {
  return (
    att.type === "ExternalUrl" ?
      <div >
        <div style={{ padding: "10px" }}>
          <div><b>{att.name}</b> (ExternalUrl)</div>
          <a href={att.location} target="mcBrain" rel="noreferrer">{att.location}</a>
        </div>
        <iframe title={att.name} src={att.location} style={{ width: "100%", height: "80vh" }} />
      </div>
      :
      <div >
        <pre>{JSON.stringify(att, undefined, 2)}</pre>
      </div>
  );
};
