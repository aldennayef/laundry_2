<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CompanyProfile extends Model
{
    use HasFactory;

    protected $table = 'tbl_company_profiles';

    protected $fillable = [
        'company_name',
        'description',
        'vision',
        'mission',
        'logo_path',
        'email',
        'phone',
        'address',
        'social_media',
    ];

    protected $casts = [
        'social_media' => 'array',
    ];
}
