<?php

namespace App\Enum;

enum DraftInteractionEnum: string
{
    case BOOK_VIEW        = 'book_view';
    case BOOK_ICON        = 'book_icon';
    case MEETING_CTA      = 'meeting_cta';
    case COURSE_CTA       = 'course_cta';
    case BOOK_MEDIA_VIDEO = 'book_media_video';
    case BOOK_MEDIA_AUDIO = 'book_media_audio';
    case BOOK_MEDIA_PDF   = 'book_media_pdf';
    case BOOK_MEDIA_LINK  = 'book_media_link';

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}
