export type TreeNode = {
  name: string;
  attributes: {
    avegTemp: number;
    tempStr: string;
    code: string;
    flag: string | null;
    height: number;
  };
  children: [left: TreeNode | EmptyTreeNode, right: TreeNode | EmptyTreeNode];
};

export type EmptyTreeNode = { name: '' };
