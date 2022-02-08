import { iThought } from "./iThought";

export async function loadThoughtData(searchText: string) {
  const apiUrl = `https://memebrane.conversence.com/brain/jerry/search?query=${encodeURI(
    searchText
  )}&lang=en&notes=on/`;
  const response = await fetch(`${apiUrl}`, {
    headers: {
      Accept: "application/json"
    }
  });
  const apiData = await response.json();
  const parents: iThought[] = [];
  for (const [key, value] of Object.entries(apiData.results)) {
    parents.push({ id: key, name: value } as iThought);
  }

  return {
    name: "",
    id: "",
    url: "",
    children: [],
    parents: parents,
    siblings: [],
    jumps: [],
    attachments: []
  };
}
