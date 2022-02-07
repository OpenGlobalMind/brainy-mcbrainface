import { iThought } from "../data/iThought";

export async function navToCrumb(
  thoughtId: string,
  event: React.MouseEvent<HTMLAnchorElement>
) {
  if (event) {
    event.preventDefault();
  }

  let _crumbs = JSON.parse(sessionStorage.getItem("crumbs") || "[]");
  const crumbIndex = _crumbs.reduceRight(
    (acc: number, crumb: iThought, index: number) => {
      return crumb.id === thoughtId ? index : acc;
    },
    -1
  );

  window.history.go(-crumbIndex);
}
