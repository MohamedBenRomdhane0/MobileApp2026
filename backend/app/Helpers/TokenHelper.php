<?php

namespace App\Helpers;

use Exception;

class TokenHelper
{
    private static int $defaultLength;
    private static int $minLength;
    private static string $hashAlgorithm;

    /**
     * Constructor to initialize default and minimum lengths from the config file.
     */
    public static function initialize(): void
    {
        self::$hashAlgorithm = config('token.HASH_ALGO', 'sha256');
        self::$defaultLength = config('token.DEFAULT_LENGTH', 60);
        self::$minLength = config('token.MIN_LENGTH', 32);
    }
    /**
     * Generate a secure token.
     *
     * @param int|null $length Desired token length (optional).
     * @return string Secure token.
     * @throws Exception If the length is less than the configured minimum.
     */
    public static function generateSecureToken(?int $length = null): string
    {
        //------> Ensure  min token length
        if (!isset(self::$defaultLength) || !isset(self::$minLength)) {
            self::initialize();
        }

        //------> Set the token length if not provided
        $length ??= self::$defaultLength;

        //------> Ensure the token length is at least the minimum
        if ($length < self::$minLength) {
            throw new Exception('Token length should be at least ' . self::$minLength . ' characters.');
        }

        //------> Generate a random binary string and encode it in a URL-safe base64 format
        $randomBytes = random_bytes(ceil($length / 2));
        $token = substr(bin2hex($randomBytes), 0, $length);

        //------> Hash the token -- This is optional, but recommended
        return hash(self::$hashAlgorithm, $token);
    }
}
