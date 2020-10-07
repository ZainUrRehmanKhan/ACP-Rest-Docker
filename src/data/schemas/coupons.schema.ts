import  {Schema} from 'mongoose';

export const CouponsSchema = new Schema({
    name: {type: String,required: true, unique: true},
    discount: {type: Number,required: true},
    oneTimeUse: {type: Boolean,default: false},
    startDate: {type: Date,required: false},
    endDate: {type: Date,required: false},
    usage : { type: Number, default: 0, required: false}
},{
  timestamps: true
});