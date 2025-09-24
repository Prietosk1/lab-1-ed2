export type TreeNode = {
  name: string;
  attributes: {
    temp: number;
    tempStr: string;
    code: string;
    flag: string | null;
    height: number;
  };
  children: [left: TreeNode | EmptyTreeNode, right: TreeNode | EmptyTreeNode];
};

type EmptyTreeNode = { name: '' };
