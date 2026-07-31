<?php

namespace App\Services;

use Illuminate\Support\Facades\Log;
use Vonage\Client as VonageClient;
use Vonage\Client\Credentials\Basic;
use Vonage\SMS\Message\SMS;

class SMSService
{
    protected VonageClient $vonage;

    public function __construct()
    {
        $this->vonage = new VonageClient(
            new Basic(config('services.vonage.key'), config('services.vonage.secret'))
        );
    }

    public function send(string $to, string $message): bool
    {
        try {
            Log::info('[SMS] Sending', [
                'to' => $to,
                'from' => config('services.vonage.sms_from'),
                'preview' => mb_substr($message, 0, 40),
            ]);

            $response = $this->vonage->sms()->send(
                new SMS($to, config('services.vonage.sms_from'), $message)
            );

            $sentSms = $response->current();
            $status = $sentSms->getStatus();

            if ($status !== 0) {
                Log::error('[SMS] Vonage send failed', [
                    'to' => $to,
                    'status' => $status,
                    'message_id' => $sentSms->getMessageId(),
                ]);
                return false;
            }

            Log::info('[SMS] Sent OK', ['to' => $to, 'message_id' => $sentSms->getMessageId()]);
            return true;
        } catch (\Throwable $e) {
            Log::error('[SMS] Vonage send failed', [
                'to' => $to,
                'error' => $e->getMessage(),
                'code' => method_exists($e, 'getCode') ? $e->getCode() : null,
            ]);
            return false;
        }
    }
}
