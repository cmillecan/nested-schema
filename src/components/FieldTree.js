class Node {
  children = {};
  parent = null;
  isOpen = false;

  constructor(data) {
    this.data = data;
  }
}

export const mergeStatus = {
  REMAIN: "REMAIN",
  ADD: "ADD",
  REMOVE: "REMOVE",
};

const mergeAndAnnotateSchemas = (left, right) => {
  const lSet = new Set(left.map((item) => item.fieldPath));
  const rSet = new Set(right.map((item) => item.fieldPath));
  const results = [];

  right.forEach((item) => {
    const { fieldPath } = item;
    if (lSet.has(fieldPath))
      results.push({ ...item, status: mergeStatus.REMAIN });
    else results.push({ ...item, status: mergeStatus.ADD });
  });

  left.forEach((item) => {
    const { fieldPath } = item;
    if (!rSet.has(fieldPath))
      results.push({ ...item, status: mergeStatus.REMOVE });
  });

  return results;
};

export class FieldTree {
  constructor() {
    this.root = new Node(null);
  }

  add = (data) => {
    const fieldPath = data.fieldPath.split(".");
    let current = this.root;
    for (let i = 0; i < fieldPath.length - 1; i++) {
      const currentPath = fieldPath[i];
      if (!current.children[currentPath]) {
        current.children[currentPath] = new Node();
        current.children[currentPath].parent = current;
      }
      current = current.children[currentPath];
    }

    const lastFieldPath = fieldPath[fieldPath.length - 1];

    if (current.children[lastFieldPath])
      current.children[lastFieldPath].data = data;
    else current.children[lastFieldPath] = new Node(data);

    if (!current.children[lastFieldPath].parent)
      current.children[lastFieldPath].parent = current;

    if (data.status === mergeStatus.ADD || data.status === mergeStatus.REMOVE) {
      current.isOpen = true;
      while (current && !current.isOpen) {
        current.isOpen = true;
        current = current.parent;
      }
    }
  };

  static merge(left, right) {
    const mergedSchema = mergeAndAnnotateSchemas(left, right);

    const resultTree = new FieldTree();
    mergedSchema.forEach(resultTree.add);

    return resultTree;
  }
}
