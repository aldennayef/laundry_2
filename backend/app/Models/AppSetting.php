<?php

declare(strict_types=1);

namespace App\Models;

use App\Domain\Enums\MapsProvider;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AppSetting extends Model
{
    use HasFactory;

    protected $table = 'tbl_app_settings';

    protected $fillable = [
        'name',
        'title',
        'logo_path',
        'favicon_path',
        'address',
        'phone',
        'email',
        'signature_path',
        'currency',
        'service_fee_type',
        'service_fee_value',
        'tax_type',
        'tax_value',
        'include_service_fee',
        'maps_provider',
        'maps_api_key',
        'maps_default_lat',
        'maps_default_lng',
        'maps_zoom',
    ];

    protected $casts = [
        'service_fee_value' => 'decimal:2',
        'tax_value' => 'decimal:2',
        'include_service_fee' => 'boolean',
        'maps_provider' => MapsProvider::class,
        'maps_default_lat' => 'decimal:7',
        'maps_default_lng' => 'decimal:7',
        'maps_zoom' => 'integer',
    ];

    protected $hidden = [
        'maps_api_key',
    ];
}
