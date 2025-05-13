<?php
namespace App\Enum;

enum RoleEnum: string
{
    case ADMIN = 'admin';
    case PARENT = 'parent';
    case TEACHER = 'teacher';
    case CHILD = 'child';
}
