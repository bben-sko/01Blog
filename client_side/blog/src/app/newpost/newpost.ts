import { CommonModule } from "@angular/common";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Component } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { Router } from "@angular/router";


type Preview = { url: string; type: string; file: File };
@Component({
  selector: 'app-new-post',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './newpost.html',
  styleUrl: './newpost.css'
})


export class NewPost {
  postContent = '';
  postErr = '';
  submitting = false;

  files: File[] = [];
  previews: Preview[] = [];

  constructor(private router: Router, private http: HttpClient) {}

  onFilesSelected(evt: Event, kind: 'image' | 'video') {
    const input = evt.target as HTMLInputElement;
    if (!input.files) return;

    Array.from(input.files).forEach((f) => {
      if (kind === 'image' && !f.type.startsWith('image/')) return;
      if (kind === 'video' && !f.type.startsWith('video/')) return;

      this.files.push(f);
      this.previews.push({ url: URL.createObjectURL(f), type: f.type, file: f });
    });

    input.value = '';
  }

  removeAt(i: number) {
    const p = this.previews[i];
    if (p) URL.revokeObjectURL(p.url);
    this.previews.splice(i, 1);
    this.files.splice(i, 1);
  }

  // Single submit path using FormData
  submit() {
    if (!this.postContent.trim() && this.files.length === 0) {
      this.postErr = 'Please add some content to your post';
      return;
    }

    const token = localStorage.getItem('jwt');
    if (!token) { this.router.navigate(['/login']); return; }

    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    const fd = new FormData();
    fd.append('content', this.postContent);
    this.files.forEach(f => fd.append('files', f));

    this.submitting = true;
    this.http.post('http://localhost:8080/api/post/createpost', fd, { headers })
      .subscribe({
        next: () => this.router.navigate(['/']),
        error: (err) => {
          this.submitting = false;
          console.error(err);
          this.postErr = err?.error?.message || err?.error?.detail || 'Failed to create post';
        }
      });
  }
  createPost() {}
  cancel() { this.router.navigate(['/']); }
}
