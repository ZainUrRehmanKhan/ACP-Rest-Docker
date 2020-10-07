import { Schema } from "mongoose";
import { UsersSchema } from '../../common/auth/users/users.schema';
import { ImagesSchema } from './images.schema';

export const PersonsSchema = new Schema({
    //username is email
    ...UsersSchema,
    name: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: false
    },
    walletPoints: {
        default: 0,
        type: Number,
    },
    provider: {
        type: String
    },
    watchList: {
        default: [],
        type: [Schema.Types.ObjectId],
        reference: 'products',
    },
    image: {
        default: null,
        type: ImagesSchema,
    },
    scope: {
        required: true,
        type: [String]
    },
    address: {
        type: String,
        required: false
    },
    token: {
        type: String,
        required: false
    }
},{
    timestamps: true
});
