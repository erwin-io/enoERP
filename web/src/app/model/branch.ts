import { ItemBranch } from "./item-branch";

export class Branch {
  branchId: string;
  branchCode: string;
  name: string;
  active: boolean;
  isMainBranch: boolean;
  itemBranches: ItemBranch[];
}
