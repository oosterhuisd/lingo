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
    Route::get('/lingo/newWord/{wordLength}', 'Api\LingoController@newWord');
    Route::post('/lingo/validate/{word}', 'Api\LingoController@validateGuess');
    Route::post('/lingo/getBonusLetter/{word}/{position}', 'Api\LingoController@getBonusLetter');
    Route::get('/lingo/getSolution/{word}', 'Api\LingoController@getSolution');

    Route::get('/puzzle/newWord/{wordLength}', 'Api\PuzzleController@newWord');
    Route::post('/puzzle/validate/{word}', 'Api\PuzzleController@validateWord');
    Route::post('/puzzle/getLetterPosition/{word}/{letter}', 'Api\PuzzleController@getLetterPosition');
});
