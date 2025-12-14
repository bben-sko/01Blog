import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService, DashboardStats, Post, ProfileReport, Report, ReportStatus, User } from '../sevice/adminservice';
import { Router } from '@angular/router';
import { ConfirmationDialog } from '../shered/confirm-dialog/confirm-dialog';

@Component({
  selector: 'app-admin',
  imports: [CommonModule, FormsModule, ConfirmationDialog],
  templateUrl: './admin.html',
  styleUrl: './admin.css'
})
export class Admin implements OnInit {

  private adminService = inject(AdminService);
  private route = inject(Router);
  stats: DashboardStats | null = null;
  users: User[] = [];
  posts: Post[] = [];
  reports: Report[] = [];
  profileReports: ProfileReport[] = [];
  reportFilter: 'ALL' | ReportStatus = 'ALL';

  activeTab: 'reports' | 'users' | 'posts' = 'reports';
  reportView: 'posts' | 'profiles' = 'posts';

  selectedReport: Report | null = null;
  selectedUser: User | null = null;
  selectedPost: Post | null = null;

  actionReason = '';
  adminNote = '';
  reportDecision: ReportStatus = 'RESOLVED';
  hidePostOnResolve = false;
  checking = false;
  loading = false;
  error = '';
  dialogOpen = false;
  dialogTitle = '';
  dialogMessage = '';
  dialogDescription = '';
  currentAction: () => void = () => {};
  constructor(private cdr: ChangeDetectorRef) {

  }

  ngOnInit() {
    this.loadDashboard();
  }

  showConfirmDialog(title: string, message: string, description: string, action: () => void) {
    this.dialogTitle = title;
    this.dialogMessage = message;
    this.dialogDescription = description;
    this.currentAction = action;
    this.dialogOpen = true;
  }

  onConfirm() {
    this.currentAction();
    this.dialogOpen = false;
  }

  onCancel() {
    this.dialogOpen = false;
  }

  loadDashboard(page: number = 0, size: number = 50) {
    this.loading = true;
    this.adminService.getDashboard(page, size).subscribe({
      next: (data) => {
        this.stats = data.stats;
        this.reports = data.postReports;
        this.profileReports = data.profileReports;
        this.users = data.users;
        this.posts = data.posts;
        this.reportFilter = 'ALL';
        this.loading = false;
        this.checking = true;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.loading = false;
        if (err.status === 401) {
          this.route.navigate(['/']);
        }
      }
    });
  }

  switchReportView(view: 'posts' | 'profiles') {
    this.reportView = view;
    if (view === 'profiles' && this.profileReports.length === 0) {
      this.loadProfileReports();
    }
  }

  loadUsers() {
    this.loading = true;
    this.adminService.getAllUsers().subscribe({
      next: (data) => {
        this.users = data;
        this.loading = false;
      },
      error: (err) => {
        if (err.status == 401) {
          this.route.navigate(['/'])
        }
      }
    });
  }
  loadReport(status: 'ALL' | ReportStatus = 'ALL') {
    this.loading = true;
    this.reportFilter = status;
    this.reportView = 'posts';

    this.adminService.getReports(status).subscribe({
      next: (data: Report[]) => {
        console.log(data);
        this.reports = data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.loading = false;
        if (err.status === 401) {
          this.route.navigate(['/']);
        }
      }
    });
  }

  loadProfileReports() {
    this.loading = true;
    this.adminService.getProfileReports().subscribe({
      next: (data) => {
        this.profileReports = data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.loading = false;
        if (err.status === 401) {
          this.route.navigate(['/']);
        }
      }
    });
  }

  loadPosts() {
    this.loading = true;
    this.adminService.getAllPosts().subscribe({
      next: (data) => {
        this.posts = data;
        this.loading = false;
      },
      error: (err) => {
        if (err.status == 401) {
          this.route.navigate(['/'])
        }
      }
    });
  }

  switchTab(tab: 'reports' | 'users' | 'posts') {
    this.activeTab = tab;
    this.error = '';
    if (tab !== 'reports') {
      this.reportView = 'posts';
    }
  }

  banUser(user: User) {
    this.showConfirmDialog('Ban User', 'Are you sure you want to ban this user?', '', () => {
      this.adminService.banUser(user.id).subscribe({
        next: () => {
          alert('User banned successfully');
          this.actionReason = '';
          this.selectedUser = null;
          this.loadDashboard();
        },
        error: (err) => {
          if (err.status == 401) {
            this.route.navigate(['/'])
          }
        }
      });
    });
  }

  unbanUser(user: User) {
    console.log('Unbanning user:', user);
    this.showConfirmDialog('Unban User', 'Are you sure you want to unban this user?', '', () => {
  
      this.adminService.unbanUser(user.id).subscribe({
        next: () => {
          alert('User unbanned successfully');
          this.loadDashboard();
  
        },
        error: (err) => {
          if (err.status == 401) {
            this.route.navigate(['/'])
          }
        }
      });
    });
  }

  deleteUser(userId: number) {
    this.showConfirmDialog('Delete User', 'Are you sure you want to permanently delete this user? This action cannot be undone.', '', () => {

      this.adminService.deleteUser(userId).subscribe({
        next: () => {
          alert('User deleted successfully');
          this.loadDashboard();
        },
        error: (err) => {
          if (err.status == 401) {
            this.route.navigate(['/'])
          }
          console.log(err)

        }
    });
    });
      

  }

  hidePost(post: Post) {
    this.showConfirmDialog('Hide Post', 'Are you sure you want to hide this post?', '', () => {
      this.adminService.hidePost(post.postId).subscribe({
        next: () => {
          alert('Post hidden successfully');
          this.adminNote = '';
          this.selectedPost = null;
          this.loadDashboard();
        },
        error: (err) => {
          if (err.status == 401) {
            this.route.navigate(['/'])
          }
        }

      });
    });
  }

  unhidePost(post: Post) {
    this.showConfirmDialog('Unhide Post', 'Are you sure you want to unhide this post?', '', () => {
  
      this.adminService.unhidePost(post.postId).subscribe({
        next: () => {
          alert('Post unhidden successfully');
          this.loadDashboard();
  
        },
        error: (err) => {
        console.error(err)
      },
    });
      

    });
    }
  
    deletePost(postId: number) {
      this.showConfirmDialog('Delete Post', 'Are you sure you want to delete this post?', '', () => {
  
      this.adminService.deletePost(postId).subscribe({
        next: () => {
          alert('Post deleted successfully');
          this.loadDashboard();
          if (this.selectedReport) {
            this.closeModal();
          }
        },
         error: (err) => {
        if (err.status == 401) {
          this.route.navigate(['/'])
        }
        console.error(err);
      }
    });
     
    });
  }

  resolveReport() {
    if (!this.selectedReport) {
      return;
    }
    if (!this.adminNote.trim()) {
      alert('Please provide an admin note');
      return;
    }

    this.showConfirmDialog('Resolve Report', 'Save this decision for the selected report?', '', () => {
      this.adminService.resolveReport(this.selectedReport!.id, {
        status: this.reportDecision,
        adminNote: this.adminNote.trim(),
        hidePost: this.hidePostOnResolve
      }).subscribe({
        next: () => {
          alert('Report updated successfully');
          this.loadDashboard();
          this.closeModal();
        },
        error: (err) => {
          if (err.status == 401) {
            this.route.navigate(['/'])
          }
        }
      });
    });
  }

  openReportModal(report: Report) {
    this.selectedReport = report;
    this.adminNote = report.adminNote || '';
    this.reportDecision = report.status === 'PENDING' ? 'RESOLVED' : report.status;
    this.hidePostOnResolve = !report.postEnabled;
  }

  openBanUserModal(user: User) {
    this.selectedUser = user;
    this.actionReason = '';
  }

  openHidePostModal(post: Post) {
    this.selectedPost = post;
    this.actionReason = '';
  }

  closeModal() {
    this.selectedReport = null;
    this.selectedUser = null;
    this.selectedPost = null;
    this.actionReason = '';
    this.adminNote = '';
    this.reportDecision = 'RESOLVED';
    this.hidePostOnResolve = false;
  }

  hidePostFromReport(postId: number) {
    this.showConfirmDialog('Hide Post', 'Hide this post based on the report?', '', () => {
      this.adminService.hidePost(postId).subscribe({
        next: () => {
          alert('Post hidden successfully');
          if (this.selectedReport && this.selectedReport.postId === postId) {
            this.selectedReport.postEnabled = false;
            this.hidePostOnResolve = true;
          }
          this.loadDashboard();
        },
        error: (err) => {
          if (err.status == 401) {
            this.route.navigate(['/'])
          }
        }
      });
    });
  }

  deletePostFromReport(postId: number) {
    this.showConfirmDialog('Delete Post', 'Are you sure you want to delete this post?', '', () => {
      this.adminService.deletePost(postId).subscribe({
        next: () => {
          alert('Post deleted successfully');
          this.loadDashboard();
          if (this.selectedReport?.postId === postId) {
            this.closeModal();
          }
        },
        error: (err) => {
          if (err.status == 401) {
            this.route.navigate(['/'])
          }
        }
      });
    });
  }
  GetViews(postId: number) {
     window.open(`post/${postId}`);
  }

  viewProfile(username: string) {
    this.route.navigate(['/profile', username]);
  }

  canBanReportedUser(username: string): boolean {
    return this.users.some((user) => user.username === username);
  }

  promptBanFromProfile(username: string) {
    const user = this.users.find((u) => u.username === username);
    if (user) {
      this.openBanUserModal(user);
    } else {
      this.viewProfile(username);
    }
  }
}
