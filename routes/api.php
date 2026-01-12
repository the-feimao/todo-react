<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\CategoryController;
use App\Http\Controllers\API\TodoController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');


Route::post('/register', [AuthController::class,'register']);
Route::post('/login', [AuthController::class,'login']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class,'logout']);
    Route::apiResource('todos', TodoController::class);
    // Categories
    Route::apiResource('categories', CategoryController::class)
        ->only(['index', 'store', 'update', 'destroy']);
});