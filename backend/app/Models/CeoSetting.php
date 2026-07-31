<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CeoSetting extends Model
{
    protected $fillable = ['code'];

    protected $hidden = ['code'];

    /**
     * Return the single settings row, or null if not configured yet.
     */
    public static function instance(): ?self
    {
        return self::first();
    }

    /**
     * Whether the CEO code has been configured.
     */
    public static function isConfigured(): bool
    {
        return self::exists();
    }

    /**
     * Check if the given plain-text code matches the stored hash.
     */
    public function verify(string $plainCode): bool
    {
        return password_verify($plainCode, $this->code);
    }
}
