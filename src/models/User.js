import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    password: String,
    lastLogin: { type: Date, default: Date.now },
    phones: [
      {
        number: String,
        ddd: String,
      },
    ],
  },
  { timestamps: true }
);

const User = mongoose.model('user', UserSchema);
export default User;
