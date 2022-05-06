export interface INote {
  id: string;
  title: string;
  content?: string;
  user_id: string;
  created_at?: string;
  cover?: string;
}

export interface INoteFolder {
  notes: string[];
  id: string;
  title: string;
  description?: string;
  created_at?: string;
  user_id: string;
}
