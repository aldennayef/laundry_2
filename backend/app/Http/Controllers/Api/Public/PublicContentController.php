<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\Public;

use App\Domain\Contracts\Repositories\ArticleRepositoryInterface;
use App\Domain\Contracts\Repositories\BannerRepositoryInterface;
use App\Domain\Contracts\Repositories\CompanyProfileRepositoryInterface;
use App\Domain\Contracts\Repositories\FaqRepositoryInterface;
use App\Domain\Contracts\Repositories\PageRepositoryInterface;
use App\Http\Controllers\Controller;
use App\Http\Resources\ArticleResource;
use App\Http\Resources\BannerResource;
use App\Http\Resources\CompanyProfileResource;
use App\Http\Resources\FaqResource;
use App\Http\Resources\PageResource;
use Illuminate\Http\JsonResponse;

final class PublicContentController extends Controller
{
    public function __construct(
        private readonly ArticleRepositoryInterface $articles,
        private readonly FaqRepositoryInterface $faqs,
        private readonly PageRepositoryInterface $pages,
        private readonly BannerRepositoryInterface $banners,
        private readonly CompanyProfileRepositoryInterface $companyProfiles,
    ) {
    }

    public function articles(): JsonResponse
    {
        return response()->json(['data' => ArticleResource::collection($this->articles->published(['author']))]);
    }

    public function article(string $slug): JsonResponse
    {
        $article = $this->articles->findBySlug($slug);
        abort_if($article === null || ! $article->is_active, 404, 'Artikel tidak ditemukan.');

        return response()->json(['data' => new ArticleResource($article)]);
    }

    public function faqs(): JsonResponse
    {
        return response()->json(['data' => FaqResource::collection($this->faqs->activeOrdered())]);
    }

    public function page(string $slug): JsonResponse
    {
        $page = $this->pages->findBySlug($slug);
        abort_if($page === null || ! $page->is_active, 404, 'Halaman tidak ditemukan.');

        return response()->json(['data' => new PageResource($page)]);
    }

    public function banners(): JsonResponse
    {
        $position = request()->query('position', 'home_hero');

        return response()->json(['data' => BannerResource::collection($this->banners->activeByPosition((string) $position))]);
    }

    public function companyProfile(): JsonResponse
    {
        $profile = $this->companyProfiles->current();

        return response()->json(['data' => $profile ? new CompanyProfileResource($profile) : null]);
    }
}
