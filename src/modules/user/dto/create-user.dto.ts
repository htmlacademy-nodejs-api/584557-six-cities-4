import { UserType } from '../../../types/user-type.enum';

export default class CreateUserDto {
  public name!: string;
  public mail!: string;
  public avatar?: string;
  public password!: string;
  public type!: UserType;
}
