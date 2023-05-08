import { UserType } from './user-type.enum';

export type User = {
  name: string;
  mail: string;
  avatar?: string;
  password: string;
  type: UserType;
};
