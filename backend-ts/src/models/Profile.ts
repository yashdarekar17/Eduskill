import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IProfile extends Document {
  name: string;
  username: string;
  Branch: 'Computer' | 'AIDS' | 'Computer science(data science)';
  mobileno?: number;
  Email: string;
  password: string;
  comparePassword(enteredPassword: string): Promise<boolean>;
}

const ProfileSchema: Schema<IProfile> = new Schema({
  name: {
    type: String,
    required: true,
  },
  username: {
    type: String,
  },
  Branch: {
    type: String,
    required: true,
    enum: ['Computer', 'AIDS', 'Computer science(data science)'],
  },
  mobileno: {
    type: Number,
  },
  Email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

// Pre-save hook to hash password
ProfileSchema.pre<IProfile>('save', async function (next) {
  const Profile = this;

  try {
    if (!Profile.isModified('password')) return next();

    if (!Profile.password || typeof Profile.password !== 'string' || Profile.password.trim() === '') {
      return next(new Error('Invalid password'));
    }

    const salt = await bcrypt.genSalt(10);
    const hashpassword = await bcrypt.hash(Profile.password, salt);
    Profile.password = hashpassword;
    next();
  } catch (err) {
    console.error('Error during password hashing:', err);
    return next(err as Error);
  }
});

// Method to compare passwords
ProfileSchema.methods.comparePassword = async function (enteredPassword: string): Promise<boolean> {
  return bcrypt.compare(enteredPassword, this.password);
};

const Profile = mongoose.model<IProfile>('Profile', ProfileSchema);
export default Profile;
