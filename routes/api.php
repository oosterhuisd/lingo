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
    Route::post('/lingo/validate', 'Api\LingoController@validateWord');
    Route::post('/lingo/getBonusLetter/{word}/{position}', 'Api\LingoController@getBonusLetter');

    Route::get('/puzzle/getWord/{wordLength}', 'Api\PuzzleController@getWord');
    Route::post('/puzzle/validate', 'Api\PuzzleController@validateWord');
    Route::post('/puzzle/getLetter', 'Api\PuzzleController@getLetter');
});
