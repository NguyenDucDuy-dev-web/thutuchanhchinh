    <?php

    return [

        /*
        |--------------------------------------------------------------------------
        | Cross-Origin Resource Sharing (CORS) Configuration
        |--------------------------------------------------------------------------
        |
        | Here you may configure your settings for cross-origin resource sharing
        | or "CORS". This determines what cross-origin operations may execute
        | in web browsers. You are free to adjust these settings as needed.
        |
        | To learn more: https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS
        |
        */

        // 'paths' => ['api/*', 'sanctum/csrf-cookie'],


        // 'allowed_methods' => ['*'],

        // 'allowed_origins' => ['*'],

        // 'allowed_origins_patterns' => [],

        // 'allowed_headers' => ['*'],

        // 'exposed_headers' => [],

        // 'max_age' => 0,

        // 'supports_credentials' => false,

        'paths' => [
            'api/*',
            'sanctum/csrf-cookie',
            'captcha',
            'authenticate',
        ],

        'allowed_methods' => ['*'],

        'allowed_origins' => [
            'http://localhost:5173',
            'http://127.0.0.1:5173',
            'http://localhost:3000',
        ],

        'allowed_origins_patterns' => [],

        'allowed_headers' => [
            'Accept',
            'Authorization',
            'Content-Type',
            'X-Requested-With',
            'X-CSRF-TOKEN',
            'X-XSRF-TOKEN',
        ],

        'exposed_headers' => [
            'Content-Type',
            'Content-Length',
            'Content-Disposition',
        ],

        'max_age' => 86400, // 24 hours

        'supports_credentials' => true,
    ];
