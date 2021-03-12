import { HookNextFunction, Schema } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { RolesEnum } from 'src/types/roles';

export const UserSchema = new Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  email: { type: String, required: true },
  role: {
    type: String,
    enum: RolesEnum,
    default: 'User',
  },
  created: {
    type: Date,
    default: Date.now,
  },
});

UserSchema.pre('save', async function (next: HookNextFunction) {
  try {
    if (!this.isModified('password')) {
      return next();
    }

    const hashed = await bcrypt.hash(this['password'], 10);
    this['password'] = hashed;
    return next();
  } catch (err) {
    return next(err);
  }
});
