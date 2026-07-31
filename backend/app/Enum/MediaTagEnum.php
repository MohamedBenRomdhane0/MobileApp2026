<?php
namespace App\Enum;
enum MediaTagEnum: string
{
    case BOOK_PDF = 'book_pdf';
    case AVATAR = 'avatar';
    case RIB = 'rib';
    case CIN = 'cin';
    case DIPLOMA = 'diploma';
    case TEACHER_TRAILER = 'teacher_trailer';
    case BOOK_PAGE = 'book_page';
    case BOOK_COVER = 'book_cover';
    case ICON_MEDIA = 'icon_media';
    case CHAPTER_VIDEO = 'chapter_video';
    case BOOK_MEDIA = 'book_media';
    case MEETING_TIME_MEDIA = 'meeting_time_media';

    case OTHER = 'other';

    public static function getValues(): array
    {
        return array_column(self::cases(), 'value');
    }
}
