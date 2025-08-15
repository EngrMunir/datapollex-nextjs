export interface ILecture {
  _id: string;
  title: string;
  lectureNumber?: number;
  videoUrl: string;
  pdfNotes: string[];
}

export type ILectureFormValues = {
  lectureNumber: string;              
  title: string;
  videoUrl: string;
  pdfNotes: { url: string }[];        
};

export interface IModule {
  _id: string;
  title: string;
  moduleNumber: number;
  lectures: ILecture[];
}

export interface ICourseDetail {
  _id: string;
  title: string;
  thumbnail: string;
  modules: IModule[];
}
export interface ICourse {
  _id?: string;
  title: string;
  thumbnail: string;
  description: string;
  price: number;
}

export interface ICourseFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialData?: ICourse;
}
export type TDecodedToken = {
  email: string;
  role: 'admin' | 'user';
  iat?: number;
  exp?: number;
};

export type TLoginValues = {
  email: string;
  password: string;
};

export type TRegisterValues = {
  name: string;
  email: string;
  password: string;
};