<!DOCTYPE html>
<html lang="ar" dir="rtl">

<head>
    <meta charset="UTF-8">
    <title>@yield('title', 'أبجيم')</title>
</head>

<body style="font-family: Arial, sans-serif; background-color: #f8f9fa; margin: 0; padding: 0; direction: rtl;">

    <table width="100%" bgcolor="#ffffff" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: auto;">
        <tr>
            <td align="center" bgcolor="#1d3b65" style="padding: 5px;"></td>
        </tr>
        <tr>
            <td align="center" bgcolor="#ffffff" style="padding: 20px;">
                <img src="https://ci3.googleusercontent.com/meips/ADKq_NYaWauhtcTe8k9JSFjBy_MP4LgeNOoP1FFXxZd2Cz4YR2RIgjQbl8DQQcv70-etkMkx3vBF7nmktUq2KalusQ=s0-d-e1-ft#https://www.abajim.com/store/1/abajim.png"
                    alt="Logo" style="width: 100px; height: auto;">
            </td>
        </tr>

        <tr>
            <td bgcolor="#ffffff" style="padding: 20px;">
                @yield('content')
            </td>
        </tr>

        <tr>
            <td bgcolor="#22bec8" style="padding: 20px; color: #fff; font-size: 12px;" align="center">
                <strong>{{ __('messages.email_contact_us') }}</strong><br>
                <a href="mailto:{{ config('mail.from.address') }}" style="color: #fff; text-decoration: none;">
                    {{ config('mail.from.address') }}
                </a><br>
                <a href="{{ config('app.url') }}" style="color: #fff; text-decoration: none;">
                    {{ config('app.url') }}
                </a><br>
                <br><br>
                {!! str_replace(':year', date('Y'), __('messages.email_rights_reserved')) !!}

            </td>
        </tr>
    </table>

</body>

</html>
