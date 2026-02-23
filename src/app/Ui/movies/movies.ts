import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { forkJoin } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

interface Genre { id: number; name: string; }
interface CastMember { id: number; name: string; character: string; profile_path: string | null; }
interface MovieDetail {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  vote_average: number;
  release_date: string;
  runtime: number;
  genres: Genre[];
  tagline: string;
  status: string;
}
interface CreditsResponse { cast: CastMember[]; }

@Component({
  selector: 'app-movies',
  standalone: true,
  imports: [CommonModule, RouterLink, HttpClientModule],
  templateUrl: './movies.html',
  styleUrls: ['./movies.css']
})
export class Movies implements OnInit {
  movie: MovieDetail | null = null;
  cast: CastMember[] = [];
  loading = true;
  error: string | null = null;

  private readonly apiKey = 'a075766ad5bb16655eea02c300a5285b';
  private readonly imageBase = 'https://image.tmdb.org/t/p/w500';
  private readonly origBase = 'https://image.tmdb.org/t/p/original';

  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) this.fetchMovieData(id);
  }

  fetchMovieData(id: string): void {
    this.loading = true;
    this.error = null;

    const detail$ = this.http.get<MovieDetail>(
      `https://api.themoviedb.org/3/movie/${id}?api_key=${this.apiKey}`
    ).pipe(catchError(() => of(null)));

    const credits$ = this.http.get<CreditsResponse>(
      `https://api.themoviedb.org/3/movie/${id}/credits?api_key=${this.apiKey}`
    ).pipe(catchError(() => of(null)));

    forkJoin([detail$, credits$]).subscribe(([movie, credits]) => {
      if (!movie) {
        this.error = 'Failed to load movie details.';
      } else {
        this.movie = movie;
        this.cast = credits?.cast?.slice(0, 12) || [];
      }
      this.loading = false;
    });
  }

  getPoster(path: string | null): string {
    return path ? `${this.imageBase}${path}` : 'https://via.placeholder.com/500x750?text=No+Image';
  }

  getBackdrop(path: string | null): string {
    return path ? `${this.origBase}${path}` : '';
  }

  getRuntime(minutes: number): string {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return h > 0 ? `${h}h ${m}m` : `${m}m`;
  }

  getRatingColor(rating: number): string {
    if (rating >= 7) return '#198754';
    if (rating >= 5) return '#f5a623';
    return '#e94560';
  }
}