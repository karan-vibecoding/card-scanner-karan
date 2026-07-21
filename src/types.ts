export interface BusinessCard {
  id?: string;
  userId: string;
  imageUrl?: string;
  fullName: string;
  firstName?: string;
  lastName?: string;
  company: string;
  designation: string;
  phoneNumbers: string[];
  emails: string[];
  website: string;
  address: string;
  linkedIn: string;
  socialLinks: string[];
  category: string;
  notes: string;
  tags: string[];
  createdAt: number;
  updatedAt: number;
}

export interface Category {
  id?: string;
  userId: string;
  name: string;
  createdAt: number;
}
