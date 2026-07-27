<?php

namespace App\Models;

use App\Models\Category;
use App\Models\OrderItem;
use App\Models\UserBook;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Book extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'category_id',
        'title',
        'slug',
        'author',
        'publisher',
        'isbn',
        'price_normal',
        'price_discount',
        'cover',
        'drive_link',
        'description',
        'is_published',
    ];

    protected function casts(): array
    {
        return [
            'price_normal' => 'decimal:2',
            'price_discount' => 'decimal:2',
            'is_published' => 'boolean',
        ];
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function orderItems(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }

    public function userBooks(): HasMany
    {
        return $this->hasMany(UserBook::class);
    }
}
