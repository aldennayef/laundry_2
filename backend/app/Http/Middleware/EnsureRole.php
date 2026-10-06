<?php

declare(strict_types=1);

namespace App\Http\Middleware;

use App\Domain\Enums\RoleEnum;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Restricts a route to one or more roles.
 * Usage: ->middleware('role:root,admin_cabang')
 */
final class EnsureRole
{
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        $user = $request->user();

        if ($user === null) {
            return response()->json(['message' => 'Silakan login terlebih dahulu.'], 401);
        }

        $allowed = array_map(static fn (string $role) => RoleEnum::from($role), $roles);

        foreach ($allowed as $role) {
            if ($user->hasRole($role)) {
                return $next($request);
            }
        }

        return response()->json(['message' => 'Anda tidak memiliki akses ke resource ini.'], 403);
    }
}
