const stringifySort = (a: unknown, b: unknown): number => {
  const aStr = typeof a === "string" ? a : JSON.stringify(a);
  const bStr = typeof b === "string" ? b : JSON.stringify(b);
  return aStr.localeCompare(bStr);
};

const sortByFirstObjectEntriesKey = (
  entryA: [key: string, value: unknown],
  entryB: [key: string, value: unknown],
): number => entryA[0].localeCompare(entryB[0]);

const deepSort = (target: unknown): unknown => {
  if (Array.isArray(target)) {
    return target.map(deepSort).sort(stringifySort);
  }
  if (typeof target === "object" && target !== null) {
    return Object.fromEntries(
      Object.entries(target).map(([key, value]) => {
        return [key, deepSort(value)] as [key: string, value: unknown];
      }).sort(sortByFirstObjectEntriesKey),
    );
  }
  return target;
};

const assertObjectIsSorted = (obj: unknown): void => {
  const objStr = JSON.stringify(obj, undefined, 2);
  const objSortedStr = JSON.stringify(deepSort(obj), undefined, 2);

  objStr.split("").forEach((val, i) => {
    if (val !== objSortedStr.charAt(i)) {
      console.log(
        `Object is not deeply sorted starting at:\n${
          objStr.slice(i).slice(0, 500)
        }`,
      );
      console.log("");
      console.log("---");
      console.log("");
      console.log(
        `Expected\n${objSortedStr.slice(i).slice(0, 500)}`,
      );
      console.log("");

      throw new Error("Object is not deeply sorted");
    }
  });
};

export const assertDefinitionIsSorted = (spec: Record<string, unknown>) => {
  const { $copyright: _copyright, ...other } = spec;
  assertObjectIsSorted(other);
};
