<?php

use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\FieldsController;
use App\Http\Controllers\Admin\FormTemplateController;
use App\Http\Controllers\Admin\FormTemplateFileController;
use App\Http\Controllers\Admin\NewsController;
use App\Http\Controllers\Admin\ProcedureController;
use App\Http\Controllers\Admin\ProcedureSubmissionController;
use App\Http\Controllers\Admin\SidebarController;
use App\Http\Controllers\Admin\TempImageController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\AuthenticationController;
use App\Http\Controllers\User\HomeController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

//1. Public route để login
// Route::post('authenticate', [AuthenticationController::class, 'authenticate']);


Route::get('form-templates/file/{filename}', [FormTemplateFileController::class, 'getFile']);

// 2. Route xác thực token, không phân biệt role (chỉ cần đang login)
Route::middleware('auth:sanctum')->get('/me', [AuthenticationController::class, 'me']);

// 3. Admin routes
Route::group(['middleware' => ['auth:sanctum']], function () {
    Route::get('dashboard', [DashboardController::class, 'index']);
    Route::get('logout', [AuthenticationController::class, 'logout']);

    Route::prefix('sidebar')->group(function () {
        Route::get('/', [SidebarController::class, 'index']);
        Route::post('/', [SidebarController::class, 'store']);
        Route::get('/{sidebar}', [SidebarController::class, 'show']);
        Route::put('/{sidebar}', [SidebarController::class, 'update']);
        Route::delete('/{sidebar}', [SidebarController::class, 'destroy']);
    });

    Route::prefix('user')->group(function () {
        Route::get('/', [UserController::class, 'index']);
        Route::post('/', [UserController::class, 'store']);
        Route::get('/{id}', [UserController::class, 'show']);
        Route::put('/{id}', [UserController::class, 'update']);
        Route::delete('/{id}', [UserController::class, 'destroy']);
    });

    Route::prefix('procedure')->group(function () {
        Route::prefix('field')->group(function () {
            Route::get('/', [FieldsController::class, 'index']);
            Route::post('/', [FieldsController::class, 'store']);


            Route::get('/tables', [FieldsController::class, 'getAllTables']);
            Route::get('/columns/{table}', [FieldsController::class, 'getTableColumns']);
            Route::get('/fields/{id}/source-data', [FieldsController::class, 'getSourceData']);

            Route::get('/{id}', [FieldsController::class, 'show']);
            Route::put('/{id}', [FieldsController::class, 'update']);
            Route::delete('/{id}', [FieldsController::class, 'destroy']);
        });

        Route::prefix('form-templates')->group(function () {
            Route::get('/', [FormTemplateController::class, 'index']);
            Route::post('/', [FormTemplateController::class, 'store']);
            Route::get('/{id}', [FormTemplateController::class, 'show']);
            Route::put('/{id}', [FormTemplateController::class, 'update']);
            Route::delete('/{id}', [FormTemplateController::class, 'destroy']);
            Route::put('/restore/{id}', [FormTemplateController::class, 'restore']);
        });

        Route::prefix('procedures')->group(function () {
            Route::get('/', [ProcedureController::class, 'index']);
            Route::post('/', [ProcedureController::class, 'store']);
            Route::get('/{id}', [ProcedureController::class, 'show']);
            Route::put('/{id}', [ProcedureController::class, 'update']);
            Route::delete('/{id}', [ProcedureController::class, 'destroy']);
        });

        Route::prefix('submission')->group(function () {
            Route::get('/', [ProcedureSubmissionController::class, 'index']);
            Route::post('/', [ProcedureSubmissionController::class, 'store']);
            Route::get('/{id}', [ProcedureSubmissionController::class, 'show']);
            Route::put('/{id}', [ProcedureSubmissionController::class, 'update']);
            Route::delete('/{id}', [ProcedureSubmissionController::class, 'destroy']);
        });
    });

    Route::prefix('news')->group(function () {
        Route::get('/', [NewsController::class, 'index']);
        Route::get('/getNewsNoiBat', [NewsController::class, 'getNewsNoiBat']);
        Route::post('/', [NewsController::class, 'store']);
        Route::get('/{id}', [NewsController::class, 'show']);
        Route::put('/{id}', [NewsController::class, 'update']);
        Route::delete('/{id}', [NewsController::class, 'destroy']);
    });

    Route::prefix('temp-images')->group(function () {
        Route::get('/', [TempImageController::class, 'index']);
        Route::post('/', [TempImageController::class, 'store']);
        Route::get('/{id}', [TempImageController::class, 'show']);
        Route::put('/{id}', [TempImageController::class, 'update']);
        Route::delete('/{id}', [TempImageController::class, 'destroy']);
    });
});

// 4. User (role = 1)
Route::group(['middleware' => ['auth:sanctum', 'check.role:1']], function () {
    Route::get('home', [HomeController::class, 'index']);
});
