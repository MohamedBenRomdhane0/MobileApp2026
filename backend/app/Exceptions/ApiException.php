<?php

namespace App\Exceptions;

use Exception;

class ApiException extends Exception
{
    public function __construct(
        public readonly string $messageKey,
        public readonly int $statusCode = 400,
        public readonly array $replace = []
    ) {
        parent::__construct($messageKey, $statusCode);
    }
}