export type MaterialType = 'past_paper' | 'short_note' | 'kuppi_video';

export interface Module {
  id: string;
  year: number;
  semester: number;
  code: string;
  name: string;
  created_at: string;
}

export interface Material {
  id: string;
  module_id: string;
  title: string;
  type: MaterialType;
  file_url: string;
  description: string;
  created_at: string;
}

export interface Database {
  public: {
    Tables: {
      modules: {
        Row: Module;
        Insert: Omit<Module, 'id' | 'created_at'>;
        Update: Partial<Omit<Module, 'id' | 'created_at'>>;
      };
      materials: {
        Row: Material;
        Insert: Omit<Material, 'id' | 'created_at'>;
        Update: Partial<Omit<Material, 'id' | 'created_at'>>;
      };
    };
  };
}
