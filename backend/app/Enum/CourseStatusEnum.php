<?php

namespace App\Enum;

enum CourseStatusEnum: string
{
  case DRAFT = 'draft';
  case PUBLISHED = 'published';
  case ARCHIVED = 'archived';
  case REFUSED = 'refused';

  public static function getValues(): array
  {
    return array_column(self::cases(), 'value');
  }
}