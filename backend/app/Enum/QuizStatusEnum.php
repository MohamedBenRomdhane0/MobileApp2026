<?php

namespace App\Enum;

enum QuizStatusEnum  : string {

  case DRAFT = 'Draft';
  case PUBLISHED = 'Published';
  case ARCHIVED = 'Archived';

  public static function getValues(): array
    {
        return array_column(self::cases(), 'value');
    }
}