import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'profile/:username',
    renderMode: RenderMode.Client  // Skip SSR for profile pages
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender
  }
];
