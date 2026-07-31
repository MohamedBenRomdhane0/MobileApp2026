@extends('emails.layout-ar')

@section('title', __('messages.email_subject_reset'))

@section('content')
    <table width="100%" cellpadding="20" dir="rtl">
        <tr>
            <td align="center">
                <h2 style="color: #1d3b65;">
                    {!! __('messages.email_reset_greeting', [
                        'name' => '<span style="color: #22bec8;">' . e($user->full_name) . '</span>',
                    ]) !!} 🔐
                </h2>
                <p>{{ __('messages.reset_password_message') }}</p>
                <p style="font-size: 24px; font-weight: bold; color: #22bec8;">{{ $code }}</p>
                <p style="font-size: 14px;">{{ __('messages.email_code_expires') }}</p>
            </td>
        </tr>
    </table>
@endsection
