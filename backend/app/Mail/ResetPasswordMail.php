<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use App\Helpers\LocaleHelper;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;

class ResetPasswordMail extends Mailable
{
    use Queueable, SerializesModels;

    public string $code;
    public object $user;

    public function __construct(string $code, object $user)
    {
        $this->code = $code;
        $this->user = $user;

        if (request() instanceof Request) {
            $locale = LocaleHelper::resolve(request());
            App::setLocale($locale);
        }
    }

    public function build()
    {
        return $this->subject(__('messages.email_subject_reset'))
            ->view('emails.reset_password')
            ->with([
                'code' => $this->code,
                'user' => $this->user,
            ]);
    }
}
