import { OfferEntity } from './../offer/offer.entity.js';
import { UserType } from '../../types/user-type.enum.js';
import { User } from '../../types/user.type.js';
import typegoose, { getModelForClass, defaultClasses, Ref } from '@typegoose/typegoose';
import { EMAIL_REGEX, MAX_USER_NAME_LENGTH, MIN_USER_NAME_LENGTH } from '../../const.js';
import { DEFAULT_AVATAR_URL } from '../../const.js';
import { createSHA256 } from '../../core/helpers/common.js';

const { prop, modelOptions } = typegoose;

export interface UserEntity extends defaultClasses.Base {}

@modelOptions({
  schemaOptions: {
    collection: 'users'
  }
})
export class UserEntity extends defaultClasses.TimeStamps implements User {
  @prop({
    required: true,
    minlength: [MIN_USER_NAME_LENGTH, `Min length for name is ${ MIN_USER_NAME_LENGTH}`],
    maxlength: [MAX_USER_NAME_LENGTH, `Max length for name is ${ MAX_USER_NAME_LENGTH}`]
  })
  public name: string;

  @prop({
    required: true,
    unique: true,
    match: [EMAIL_REGEX, 'Email is incorrect'],
  })
  public mail: string;

  @prop({
    default: DEFAULT_AVATAR_URL
  })
  public avatar?: string;

  @prop({
    required: true,
  })
  private password?: string;

  @prop({
    type: () => String,
    enum: UserType,
    required: true
  })
  public type: UserType;

  @prop({
    ref: OfferEntity
  })
  public favorites!: Ref<OfferEntity>[];

  constructor(userData: User) {
    super();

    this.name = userData.name;
    this.mail = userData.mail;
    this.avatar = userData.avatar || DEFAULT_AVATAR_URL;
    this.type = userData.type;
  }

  public setPassword(password: string, salt: string) {
    this.password = createSHA256(password, salt);
  }

  public getPassword() {
    return this.password;
  }
}


export const UserModel = getModelForClass(UserEntity);
