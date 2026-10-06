<?php

declare(strict_types=1);

namespace App\Infrastructure\Providers;

use App\Domain\Contracts\Repositories\AddressRepositoryInterface;
use App\Domain\Contracts\Repositories\AppSettingRepositoryInterface;
use App\Domain\Contracts\Repositories\ArticleRepositoryInterface;
use App\Domain\Contracts\Repositories\BannerRepositoryInterface;
use App\Domain\Contracts\Repositories\BookingRepositoryInterface;
use App\Domain\Contracts\Repositories\BookingStatusLogRepositoryInterface;
use App\Domain\Contracts\Repositories\CompanyProfileRepositoryInterface;
use App\Domain\Contracts\Repositories\FaqCategoryRepositoryInterface;
use App\Domain\Contracts\Repositories\FaqRepositoryInterface;
use App\Domain\Contracts\Repositories\LoyaltyRuleRepositoryInterface;
use App\Domain\Contracts\Repositories\MembershipTierRepositoryInterface;
use App\Domain\Contracts\Repositories\OrderScheduleRepositoryInterface;
use App\Domain\Contracts\Repositories\PageRepositoryInterface;
use App\Domain\Contracts\Repositories\PointTransactionRepositoryInterface;
use App\Domain\Contracts\Repositories\ServiceCategoryRepositoryInterface;
use App\Domain\Contracts\Repositories\ServiceRepositoryInterface;
use App\Domain\Contracts\Repositories\ServiceTypeRepositoryInterface;
use App\Domain\Contracts\Repositories\ServiceUnitRepositoryInterface;
use App\Domain\Contracts\Repositories\StoreRepositoryInterface;
use App\Domain\Contracts\Repositories\UserRepositoryInterface;
use App\Domain\Contracts\Repositories\VoucherRedemptionRepositoryInterface;
use App\Domain\Contracts\Repositories\VoucherRepositoryInterface;
use App\Domain\Contracts\Repositories\WebSettingRepositoryInterface;
use App\Infrastructure\Repositories\AddressRepository;
use App\Infrastructure\Repositories\AppSettingRepository;
use App\Infrastructure\Repositories\ArticleRepository;
use App\Infrastructure\Repositories\BannerRepository;
use App\Infrastructure\Repositories\BookingRepository;
use App\Infrastructure\Repositories\BookingStatusLogRepository;
use App\Infrastructure\Repositories\CompanyProfileRepository;
use App\Infrastructure\Repositories\FaqCategoryRepository;
use App\Infrastructure\Repositories\FaqRepository;
use App\Infrastructure\Repositories\LoyaltyRuleRepository;
use App\Infrastructure\Repositories\MembershipTierRepository;
use App\Infrastructure\Repositories\OrderScheduleRepository;
use App\Infrastructure\Repositories\PageRepository;
use App\Infrastructure\Repositories\PointTransactionRepository;
use App\Infrastructure\Repositories\ServiceCategoryRepository;
use App\Infrastructure\Repositories\ServiceRepository;
use App\Infrastructure\Repositories\ServiceTypeRepository;
use App\Infrastructure\Repositories\ServiceUnitRepository;
use App\Infrastructure\Repositories\StoreRepository;
use App\Infrastructure\Repositories\UserRepository;
use App\Infrastructure\Repositories\VoucherRedemptionRepository;
use App\Infrastructure\Repositories\VoucherRepository;
use App\Infrastructure\Repositories\WebSettingRepository;
use Illuminate\Support\ServiceProvider;

/**
 * Binds every repository contract to its Eloquent implementation.
 *
 * This is the single place where the Domain layer is wired to Infrastructure,
 * keeping the application dependency-inverted and easy to swap.
 */
final class RepositoryServiceProvider extends ServiceProvider
{
    /**
     * @var array<class-string, class-string>
     */
    public array $bindings = [
        UserRepositoryInterface::class => UserRepository::class,
        StoreRepositoryInterface::class => StoreRepository::class,
        ServiceCategoryRepositoryInterface::class => ServiceCategoryRepository::class,
        ServiceRepositoryInterface::class => ServiceRepository::class,
        ServiceUnitRepositoryInterface::class => ServiceUnitRepository::class,
        ServiceTypeRepositoryInterface::class => ServiceTypeRepository::class,
        OrderScheduleRepositoryInterface::class => OrderScheduleRepository::class,
        BookingRepositoryInterface::class => BookingRepository::class,
        BookingStatusLogRepositoryInterface::class => BookingStatusLogRepository::class,
        VoucherRepositoryInterface::class => VoucherRepository::class,
        VoucherRedemptionRepositoryInterface::class => VoucherRedemptionRepository::class,
        PointTransactionRepositoryInterface::class => PointTransactionRepository::class,
        LoyaltyRuleRepositoryInterface::class => LoyaltyRuleRepository::class,
        MembershipTierRepositoryInterface::class => MembershipTierRepository::class,
        ArticleRepositoryInterface::class => ArticleRepository::class,
        FaqRepositoryInterface::class => FaqRepository::class,
        FaqCategoryRepositoryInterface::class => FaqCategoryRepository::class,
        PageRepositoryInterface::class => PageRepository::class,
        BannerRepositoryInterface::class => BannerRepository::class,
        CompanyProfileRepositoryInterface::class => CompanyProfileRepository::class,
        AddressRepositoryInterface::class => AddressRepository::class,
        AppSettingRepositoryInterface::class => AppSettingRepository::class,
        WebSettingRepositoryInterface::class => WebSettingRepository::class,
    ];
}
