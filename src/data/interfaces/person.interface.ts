import { IUser } from 'src/common/auth/users/user.interface';
import { IImage } from './image.interface';

export interface IPerson extends IUser {
    name: string,
    phone: string,
    walletPoints: number,
    image: IImage,
    provider: string,
    watchList: [string]
    scope: [string]
    address: string
    token: string
}
