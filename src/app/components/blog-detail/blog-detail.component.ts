import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import blogsData from '../../../assets/data/blogs.json';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-blog-detail',
  imports: [CommonModule, FormsModule],
  templateUrl: './blog-detail.component.html',
  styleUrl: './blog-detail.component.css'
})
export class BlogDetailComponent implements OnInit {

 blog: any = null;
  today = new Date();

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.blog = blogsData.find(b => b.id === id);
  }

  goBack() {
    this.router.navigate(['/home']);
  }
}
