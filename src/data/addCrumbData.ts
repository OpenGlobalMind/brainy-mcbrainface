import { iThought } from "./iThought";

export async function addCrumbData(thought: iThought) {
  let crumbs: iThought[] = [];
  crumbs = JSON.parse(sessionStorage.getItem("crumbs") || "[]");
  const crumbIndex = crumbs.reduceRight(
    (acc: number, crumb: iThought, index: number) => {
      return crumb.id === thought.id ? index : acc;
    },
    -1
  );

  if (crumbIndex >= 0) {
    crumbs = crumbs.slice(crumbIndex);
  } else {
    crumbs.unshift(thought);
  }

  sessionStorage.setItem("crumbs", JSON.stringify(crumbs));
  return crumbs;
}
