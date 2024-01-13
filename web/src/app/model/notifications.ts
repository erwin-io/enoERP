import { Branch } from "./branch";
import { Item } from "./item";
import { Supplier } from "./supplier";
import { Users } from "./users";
import { Warehouse } from "./warehouse";

export class Notifications {
  notificationId: string;
  title: string;
  description: string;
  type: string;
  referenceId: string;
  isRead: boolean;
  user: Users;
  date: string;
}
