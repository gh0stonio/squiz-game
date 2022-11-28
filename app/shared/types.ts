import { type User as FirebaseUser } from 'firebase/auth';

export type User = {
  uid: FirebaseUser['uid'];
  name: FirebaseUser['displayName'];
  email: FirebaseUser['email'];
  emailVerified?: FirebaseUser['emailVerified'];
  photoURL?: FirebaseUser['photoURL'];
};

export interface Team {
  id: string;
  name: string;
  members: User[];
  leader: User;
}

export interface Question {
  id: string;
  order: number;
  text: string;
  answer: string;
  duration: number;
  maxPoints: number;
  image?: string;
  createdAt: number;
  updatedAt?: number;
  status: 'ready' | 'in progress' | 'correcting' | 'done';
  startedAt?: number;
}

export interface Quiz {
  id: string;
  name: string;
  description: string;
  maxMembersPerTeam: number;
  status: 'ready' | 'in progress' | 'finished';
  createdAt: number;
  updatedAt?: number;
}
