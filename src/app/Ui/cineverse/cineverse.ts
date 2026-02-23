import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';
import { catchError, map } from 'rxjs/operators';
import { of } from 'rxjs';

interface TmdbMovie {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  vote_average: number;
  release_date: string;
}

interface TmdbResponse {
  results: TmdbMovie[];
}

@Component({
  selector: 'app-cineverse',
  standalone: true,
  imports: [CommonModule, HttpClientModule, RouterLink],
  templateUrl: './cineverse.html',
  styleUrls: ['./cineverse.css']
})
export class Cineverse implements OnInit {
  movies: TmdbMovie[] = [];
  loading = true;
  error: string | null = null;
  activeCategory = 'trending';

  private readonly apiKey = 'a075766ad5bb16655eea02c300a5285b';
  private readonly imageBase = 'https://image.tmdb.org/t/p/w500';

  categories = [
    { key: 'trending', label: 'Trending' },
    { key: 'popular', label: 'Popular' },
    { key: 'top_rated', label: 'Top Rated' },
    { key: 'now_playing', label: 'Now Playing' }
  ];

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.fetchMovies('trending');
  }

  fetchMovies(category: string): void {
    this.loading = true;
    this.error = null;
    this.activeCategory = category;

    let url = '';
    if (category === 'trending') {
      url = `https://api.themoviedb.org/3/trending/movie/week?api_key=${this.apiKey}`;
    } else {
      url = `https://api.themoviedb.org/3/movie/${category}?api_key=${this.apiKey}`;
    }

    this.http.get<TmdbResponse>(url).pipe(
      map(res => res.results || []),
      catchError(() => {
        this.error = 'Failed to load movies. Please check your API key.';
        return of([] as TmdbMovie[]);
      })
    ).subscribe(movies => {
      this.movies = movies;
      this.loading = false;
    });
  }

  getPoster(path: string): string {
    return path ? `${this.imageBase}${path}` : 'https://via.placeholder.com/500x750?text=No+Image';
  }

  getRatingClass(rating: number): string {
    if (rating >= 7) return 'badge-high';
    if (rating >= 5) return 'badge-mid';
    return 'badge-low';
  }

  goToDetail(id: number): void {
    this.router.navigate(['/cineverse', id]);
  }
}