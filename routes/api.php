<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

//Route::group(['middleware'=>['auth:api']], function() {
Route::group([], function() {
    Route::get('/lingo/getWord/{wordLength}', 'Api\LingoController@getWord');
    Route::post('/lingo/validate/{wordId}', 'Api\LingoController@validateWord');

    Route::get('/puzzle/getWord/{wordLength}', 'Api\PuzzleController@getWord');
    Route::post('/puzzle/validate/{wordId}', 'Api\PuzzleController@validateWord');
});
