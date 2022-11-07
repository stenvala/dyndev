const PRE_SORT = [
  'TYPE',
  'PK',
  'SK',
  ...Array.apply(null, Array(5)).map((val, i) => [
    `GSI${i + 1}PK`,
    `GSI${i + 1}SK`,
  ]),
].flat();
const PRE_SORT_SET = new Set<string>(PRE_SORT);

type StringifyComp = {
  key: string;
  value: any;
};

export function keySorter(
  a: string | StringifyComp,
  b: string | StringifyComp
) {
  if (typeof a !== 'string') {
    a = a.key;
  }
  if (typeof b !== 'string') {
    b = b.key;
  }

  if (PRE_SORT_SET.has(a) || PRE_SORT_SET.has(b)) {
    for (let i = 0; i < PRE_SORT.length; i++) {
      if (a === PRE_SORT[i]) {
        return -1;
      }
      if (b === PRE_SORT[i]) {
        return 1;
      }
    }
  }
  return a < b ? -1 : 1;
}
