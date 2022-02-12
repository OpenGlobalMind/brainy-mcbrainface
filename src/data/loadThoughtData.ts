import { iThought } from "./iThought";
import { iRoot } from "./iRoot";

export async function loadThoughtData(thoughtId: string, brainId:string) {
  const apiUrl = `https://memebrane.conversence.com/brain/${brainId}/thought/${thoughtId}/`;
  const response = await fetch(`${apiUrl}`, {
    headers: {
      Accept: "application/json"
    }
  });
  const apiData = await response.json();

  const thoughtsIndex: { [key: string]: iThought } = {};
  for (const thought of apiData.thoughts) {
    if (thought.foregroundColor === -256) {
      thought.color = "yellow";
    } else if (thought.foregroundColor === -28417) {
      thought.color = "#EC86EE";
    } else {
      thought.color = "white";
    }
    thoughtsIndex[thought.id] = thought;
  }

  const root: iRoot = apiData.root;
  const children = root.children.map((c) => thoughtsIndex[c]);
  const parents = root.parents.map((c) => thoughtsIndex[c]);
  const siblings = root.siblings.map((c) => thoughtsIndex[c]);
  const jumps = root.jumps.map((c) => thoughtsIndex[c]);
  const attachments = root.attachments;
  const url = attachments.find((a) => a.location)?.location;

  return {
    ...thoughtsIndex[root.id],
    children: children,
    parents: parents,
    siblings: siblings,
    jumps: jumps,
    attachments: attachments,
    url: url
  };
}
