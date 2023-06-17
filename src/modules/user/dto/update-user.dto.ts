import { IsEmail, IsEnum, IsMongoId, IsOptional, IsString, IsUrl, Length, Matches, MaxLength, MinLength } from 'class-validator';
import { UserType } from '../../../types/user-type.enum.js';
import { EMAIL_REGEX, MAX_USER_NAME_LENGTH, MAX_USER_PASSWORD_LENGTH, MIN_USER_NAME_LENGTH, MIN_USER_PASSWORD_LENGTH } from '../user.constant.js';

export default class UpdateUserDto {
  @IsOptional()
  @IsString({ message: 'name is required' })
  @MinLength(MIN_USER_NAME_LENGTH, { message: `Min user name length is ${MIN_USER_NAME_LENGTH}` })
  @MaxLength(MAX_USER_NAME_LENGTH, { message: `Max user name length is ${MAX_USER_NAME_LENGTH}` })
  public name?: string;

  @IsEmail({}, { message: 'email must be valid address' })
  @Matches(EMAIL_REGEX, { message: 'wrong email' })
  @IsOptional()
  public mail?: string;

  @IsString({message: 'avatar path is required'})
  @IsUrl(undefined, { message: 'avatar URL is not valid.' })
  @IsOptional()
  public avatar?: string;

  @IsString({message: 'password is required'})
  @Length(
    MIN_USER_PASSWORD_LENGTH,
    MAX_USER_PASSWORD_LENGTH,
    { message: `Min length for password is ${MIN_USER_PASSWORD_LENGTH}, max is ${MAX_USER_PASSWORD_LENGTH}` }
  )
  @IsOptional()
  public password?: string;

  @IsEnum(UserType, { message: 'Wrong UserType' })
  @IsOptional()
  public type?: UserType;

  @IsOptional()
  @IsMongoId()
  public favorites?: string[] | string;
}
