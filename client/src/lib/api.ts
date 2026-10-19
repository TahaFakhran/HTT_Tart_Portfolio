import type { Project, SiteSettings } from '../types';
const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:4000/api';
async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, init);
  if (!response.ok) throw new Error((await response.json().catch(() => null))?.error ?? 'Request failed');
  return response.json() as Promise<T>;
}
export async function getProjects(): Promise<Project[]> { return request<Project[]>('/projects'); }
export async function getProject(slug: string): Promise<Project | undefined> { try { return await request<Project>(`/projects/${encodeURIComponent(slug)}`); } catch (error) { if (error instanceof Error && error.message.toLowerCase().includes('not found')) return undefined; throw error; } }
export function assetUrl(path: string): string { return path.startsWith('http://') || path.startsWith('https://') ? path : `${API_BASE.replace(/\/api$/, '')}${path.startsWith('/') ? path : `/${path}`}`; }
export async function getSettings(): Promise<SiteSettings> { return request<SiteSettings>('/settings'); }
export async function sendContact(data: {name:string;email:string;message:string}): Promise<void> { await request('/contact',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)}); }
export async function login(email: string, password: string): Promise<string> { const data = await request<{token:string}>('/auth/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email,password})}); return data.token; }
export function adminRequest<T>(path: string, token: string, init?: RequestInit): Promise<T> { return request<T>(`/admin${path}`,{...init,headers:{...(init?.headers ?? {}),Authorization:`Bearer ${token}`}}); }
export { API_BASE };
