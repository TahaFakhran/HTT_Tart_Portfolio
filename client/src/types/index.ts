export type Language = 'en' | 'fr';
export type ProjectMedia = { id?: number; file_path: string; media_type: 'image' | 'gif' | 'video'; alt_text?: string | null; sort_order?: number };
export type Project = {
  id: number; title_en: string; title_fr: string; slug: string; description_en: string; description_fr: string; category: string;
  cover_image: string; cover_media_type: 'image' | 'gif' | 'video'; media?: ProjectMedia[]; year: number | null; featured: boolean; published: boolean; created_at?: string;
};
export type SiteSettings = { [key: string]: string };
