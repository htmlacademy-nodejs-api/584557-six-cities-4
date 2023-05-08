import { readFileSync } from 'node:fs';
import { FileReaderInterface } from './file-reader.interface.js';
import { Offer } from '../../types/offer.type.js';
import { City } from '../../types/city.type.js';
import { HouseType } from '../../types/house-type.type.js';
import { Feature } from '../../types/feature.type.js';

export default class TSVFileReader implements FileReaderInterface {
  private rawData = '';

  constructor(public filename: string) { }

  public read(): void {
    this.rawData = readFileSync(this.filename, { encoding: 'utf8' });
  }

  public toArray(): Offer[] {
    if (!this.rawData) {
      return [];
    }

    return this.rawData
      .split('\n')
      .filter((row) => row.trim() !== '')
      .map((line) => line.split('\t'))
      .map(([title, description, createdDate, city, preview, photos, premium, favorite, rating, houseType, roomNumber, guests, price, features, author, coments, coords]) => ({
        title,
        description,
        postDate: new Date(createdDate),
        city: (city as City),
        preview,
        photos: photos.split(';'),
        premium: Boolean(premium),
        favorite: Boolean(favorite),
        rating: Number.parseFloat(rating),
        houseType: (houseType as HouseType),
        roomNumber: Number.parseInt(roomNumber, 10),
        guests: Number.parseInt(guests, 10),
        price: Number.parseInt(price, 10),
        author,
        features: (features.split(';') as Feature[]),
        coments: Number.parseInt(coments, 10),
        coords: {
          lng: Number.parseFloat(coords.split(';')[0]),
          lat: Number.parseFloat(coords.split(';')[1])
        }
      }));
  }
}
