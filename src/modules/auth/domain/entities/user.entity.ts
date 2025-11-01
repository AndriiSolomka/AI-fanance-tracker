export type User = {
  id: string;
  email: string;
  passwordHash: string;
  firstName: string;
  lastName: string;
  isEmailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
};
