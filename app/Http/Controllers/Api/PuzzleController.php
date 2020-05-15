<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class PuzzleController extends Controller
{
    public function getWord(Request $request, int $wordLength) {
        return [
            'id' => 1,
            'length' => $wordLength,
            'letters' => 'ABCDEFGHIJKL',
            'strategy' => 'reverse' // in what order should drawn letters be filled?
        ];
    }

    public function validateWord(Request $request, $wordId) {
        return response()->json([
            'correct' => [1,2],
            'contains' => [3,4]
        ])->status(200);

//        return response()->json([
//            'correct' => [1,2],
//            'contains' => [3,4]
//        ])->status(400);
    }

    public function getLetter(Request $request) {

    }

    public function getPositions(Request $request) {
        $wordId = $request->input('id');
        $letters = $request->input('letters');
        return response()->json([
            'positions' => [
                0 => 'A',
                1 => 'B'
            ]
         ]);
    }
}
