import { Schema, models, model } from 'mongoose';

const UserSchema = new Schema(
  {
    name: String,
    email: { type: String, unique: true },
    password: String, // Optional if using Google only
    provider: String, // 'google' or 'credentials'
    image: String, // From Google
    role: { type: String, enum: ["user", "admin"], default: "user" },
    preferredRole: { type: String, default: "" },
    preferredLocation: { type: String, default: "" },
  },
  { timestamps: true }
);

export const User = models.User || model('User', UserSchema);
