const PrefixSortFinder = /^.\d*/gm;

export function removeSortPrefix(thoughtName: string) {
    if (thoughtName?.slice(0, 1) === ".") {
        const match = thoughtName.match(PrefixSortFinder);
        if (match) {
            return thoughtName.slice(match[0].length)
        }
    }
    return thoughtName;
}