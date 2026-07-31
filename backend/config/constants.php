<?php

return [
    'PAGINATE' => [
        'DEFAULT_PAGE' => 1,
        'DEFAULT_PER_PAGE' => 9,
        'DEFAULT_ORDER_BY' => 'created_at',
        'DEFAULT_DIRECTION' => 'DESC',
        'DEFAULT_PAGINATION' => 1,
    ],
    'MIME_TYPES' => 'jpg,png,jpeg,gif,,svg,PNG,JPG,JPEG,GIF,SVG,mp4',
    'MAX_FILE_SIZE' => 50000 , // 10MB
    'MAX_VIDEO_SIZE' => 99000, // 99MB

    'MIN_PASSWORD_LENGTH' => 8,
    'PASSWORD_REGEX' => '/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/',
    'MAX_STRING_LENGTH' => 255,
    'MEDIA_MIMES' => 'jpg,jpeg,png,bmp,gif,svg,webp,mp4,mp3,pdf,m3u8,ts,flv,avi,mov,wmv,webm,ogg,ogv,mpg,mpeg,3gp,3g2',
    'CURRENCY_MIN_VALUE' => 0,

    'MAX_CHILDREN_ACCOUNTS' => 3,

];

