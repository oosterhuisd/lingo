<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class LingoController extends Controller
{

    public function getWord(Request $request, int $wordLength) {
        return [
            'id' => 1,
            'length' => $wordLength,
            'firstLetter' => 'A',
        ];
    }

    public function validateWord(Request $request) {
        return response()->json([
            'correct' => [1,2],
            'contains' => [3,4]
        ])->status(200);

//        return response()->json([
//            'correct' => [1,2],
//            'contains' => [3,4]
//        ])->status(400);
    }

}
