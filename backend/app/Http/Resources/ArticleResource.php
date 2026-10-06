<?php

declare(strict_types=1);

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin \App\Models\Article
 */
final class ArticleResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'slug' => $this->slug,
            'content' => $this->when($request->routeIs('*.show', '*.detail'), $this->content),
            'excerpt' => $this->content !== null ? \Illuminate\Support\Str::limit(strip_tags($this->content), 160) : null,
            'thumbnail_url' => $this->thumbnail_path ? asset('storage/'.$this->thumbnail_path) : null,
            'published_at' => $this->published_at?->toIso8601String(),
            'is_active' => $this->is_active,
            'author' => $this->whenLoaded('author', fn () => $this->author?->username ?? $this->author?->email),
        ];
    }
}
