import { City } from './city.type';
import { Coords } from './coords.type';
import { Feature } from './feature.type';
import { HouseType } from './house-type.type';

export type Offer = {
  title: string;
  description: string;
  postDate: Date;
  city: City;
  preview: string;
  photos: string[];
  premium: boolean;
  favorite: boolean;
  rating: number;
  houseType: HouseType;
  roomNumber: number;
  guests: number;
  price: number;
  features: Feature[];
  author: string;
  coments: number;
  coords: Coords;
};
