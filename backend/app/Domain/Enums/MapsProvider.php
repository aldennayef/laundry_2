<?php

declare(strict_types=1);

namespace App\Domain\Enums;

enum MapsProvider: string
{
    case GOOGLE = 'google';
    case OPENSTREETMAP = 'openstreetmap';
    case MAPBOX = 'mapbox';
    case LEAFLET = 'leaflet';

    public function label(): string
    {
        return match ($this) {
            self::GOOGLE => 'Google Maps',
            self::OPENSTREETMAP => 'OpenStreetMap',
            self::MAPBOX => 'Mapbox',
            self::LEAFLET => 'Leaflet',
        };
    }

    /**
     * Providers that require an API key to be configured.
     */
    public function requiresApiKey(): bool
    {
        return in_array($this, [self::GOOGLE, self::MAPBOX], true);
    }

    public static function values(): array
    {
        return array_map(static fn (self $provider): string => $provider->value, self::cases());
    }
}
