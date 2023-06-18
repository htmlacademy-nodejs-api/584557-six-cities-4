import { ArrayMaxSize, ArrayMinSize, IsArray, IsBoolean, IsDateString, IsEnum, IsIn, IsInt, IsOptional, IsString, IsUrl, Max, MaxLength, Min, MinLength, ValidateNested } from 'class-validator';
import { CityName } from '../../../types/city.type.js';
import { Coords } from '../../../types/coords.type.js';
import { Feature } from '../../../types/feature.enum.js';
import { HouseType } from '../../../types/house-type.enum.js';
import { MAX_GUESTS_QUANTITY, MAX_OFFER_DESCRIPTION_LENGTH, MAX_OFFER_RATING, MAX_OFFER_TITLE_LENGTH, MAX_RENTAL_PRICE, MAX_ROOM_QUANTITY, MIN_GUESTS_QUANTITY, MIN_OFFER_DESCRIPTION_LENGTH, MIN_OFFER_RATING, MIN_OFFER_TITLE_LENGTH, MIN_RENTAL_PRICE, MIN_ROOM_QUANTITY, OFFER_PHOTOS_QUANTITY } from '../offer.constant.js';
import { CITIES } from '../../../const.js';

export default class UpdateOfferDto {
  @IsOptional()
  @IsString({ message: 'premium should be string' })
  @MinLength(MIN_OFFER_TITLE_LENGTH, { message: `Min offer title length is ${MIN_OFFER_TITLE_LENGTH}` })
  @MaxLength(MAX_OFFER_TITLE_LENGTH, { message: `Max offer title length is ${MAX_OFFER_TITLE_LENGTH}` })
  public title?: string;

  @IsOptional()
  @IsString({ message: 'premium should be string' })
  @MinLength(
    MIN_OFFER_DESCRIPTION_LENGTH,
    { message: `Min offer description length is ${MIN_OFFER_DESCRIPTION_LENGTH}` }
  )
  @MaxLength(
    MAX_OFFER_DESCRIPTION_LENGTH,
    { message: `Max offer description length is ${MAX_OFFER_DESCRIPTION_LENGTH}` }
  )
  public description?: string;

  @IsOptional()
  @IsDateString({}, {message: 'postDate must be valid ISO date'})
  public postDate?: Date;

  @IsOptional()
  @IsIn(Object.keys(CITIES), { message: 'Wrong city name' })
  public cityName?: CityName;

  @IsOptional()
  @IsString({ message: 'preview should be string' })
  @IsUrl(undefined, { message: 'preview URL is not valid.' })
  public preview?: string;

  @IsOptional()
  @ArrayMinSize(OFFER_PHOTOS_QUANTITY, { message: `The number of photos should be ${OFFER_PHOTOS_QUANTITY}` })
  @ArrayMaxSize(OFFER_PHOTOS_QUANTITY, { message: `The number of photos should be ${OFFER_PHOTOS_QUANTITY}` })
  @IsUrl(undefined, { message: 'preview URL is not valid.', each: true })
  public photos?: string[];

  @IsOptional()
  @IsBoolean({ message: 'premium should be boolean' })
  public premium?: boolean;

  @IsOptional()
  @IsBoolean({ message: 'premium should be boolean' })
  public favorite?: boolean;

  @IsOptional()
  @IsInt({ message: 'Rating must be an integer' })
  @Min(MIN_OFFER_RATING, { message: `Min rating is ${MIN_OFFER_RATING}` })
  @Max(MAX_OFFER_RATING, { message: `Max rating is ${MAX_OFFER_RATING}` })
  public rating?: number;

  @IsOptional()
  @IsEnum(HouseType, { message: 'Wrong HouseType' })
  public houseType?: HouseType;

  @IsOptional()
  @IsInt({ message: 'RoomNumber must be an integer' })
  @Min(MIN_ROOM_QUANTITY, { message: `Min roomNumber is ${MIN_ROOM_QUANTITY}` })
  @Max(MAX_ROOM_QUANTITY, { message: `Max roomNumber is ${MAX_ROOM_QUANTITY}` })
  public roomNumber?: number;

  @IsOptional()
  @IsInt({ message: 'Guests must be an integer' })
  @Min(MIN_GUESTS_QUANTITY, { message: `Min guests is ${MIN_GUESTS_QUANTITY}` })
  @Max(MAX_GUESTS_QUANTITY, { message: `Max guests is ${MAX_GUESTS_QUANTITY}` })
  public guests?: number;

  @IsOptional()
  @IsInt({ message: 'Price must be an integer' })
  @Min(MIN_RENTAL_PRICE, { message: `Min price is ${MIN_RENTAL_PRICE}` })
  @Max(MAX_RENTAL_PRICE, { message: `Max price is ${MAX_RENTAL_PRICE}` })
  public price?: number;

  @IsOptional()
  @IsArray({ message: 'Features should be array' })
  @IsEnum(Feature, { each: true, message: 'Wrong feature name' })
  public features?: Feature[];

  @IsOptional()
  @ValidateNested()
  public coords?: Coords;
}
