<?php
namespace App\Enum;

enum RoleEnum: string
{
    case ADMIN = 'admin';
    case PARENT = 'parent';
    case TEACHER = 'teacher';
    case CHILD = 'child';
    case STAFF = 'staff';
    public static function getValues(): array
        {
            return array_column(self::cases(), 'value');
        }
}
    