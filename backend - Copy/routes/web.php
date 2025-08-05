<?php

use App\Http\Controllers\AuthenticationController;
use Illuminate\Support\Facades\Route;
use Mews\Captcha\Facades\Captcha;

Route::post('authenticate', [AuthenticationController::class, 'authenticate'])
    ->middleware('web');

Route::get('/captcha', function () {
    return response()->json([
        'captcha' => Captcha::create('default', true),
    ]);
});
