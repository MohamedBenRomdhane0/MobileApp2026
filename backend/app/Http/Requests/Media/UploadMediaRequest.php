<?php

namespace App\Http\Requests\Media;

use App\Enum\MediaTypeEnum;
use Illuminate\Foundation\Http\FormRequest;

class UploadMediaRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'media' => 'required_without:media_url|file|mimetypes:' . implode(',', MediaTypeEnum::getUploadedFileMimeTypes()),
            'media_url' => 'required_without:media|url',
            'thumbnail' => 'nullable|file|image|max:10240',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string|max:1000',
        ];
    }

    public function messages(): array
    {
        return [
            'media.required_without' => 'Either a media file or media URL is required.',
            'media.mimetypes' => 'Only image, video, audio, and pdf files are allowed.',
            'media_url.required_without' => 'Either a media file or media URL is required.',
            'media_url.url' => 'The media URL must be a valid URL.',
        ];
    }
}
