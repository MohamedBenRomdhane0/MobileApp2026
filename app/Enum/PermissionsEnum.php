<?php
namespace App\Enum;

enum PermissionsEnum: string
{
    case CREATE_USER = 'create user';
    case VIEW_USER = 'view user';
    case UPDATE_USER = 'update user';
    case DELETE_USER = 'delete user';
    case CREATE_ROLE = 'create role';
    case VIEW_ROLE = 'view role';
    case UPDATE_ROLE = 'update role';
    case DELETE_ROLE = 'delete role';
    case VIEW_PERMISSION = 'view permission';
}
