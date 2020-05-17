<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Word;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use const http\Client\Curl\Features\HTTP2;

class LingoController extends Controller
{

    public function newWord(Request $request, int $wordLength) {
        $word = Word::whereLength($wordLength)->inRandomOrder()->limit(1)->first();
        return [
            'id' => $word->id,
            'length' => $wordLength,
            'firstLetter' => $word->word[0],
        ];
    }

    public function validateWord(Request $request) {
        $word = Word::find($request->input('id'));
        $guess = strtolower(trim($request->input('guess')));
        if ($guess === $word->word) {
            return response()->json(['win'=>true]);
        }

        // the words must be the same length and they have to start with the same letters
        if (strlen($guess) !== strlen($word->word) || $guess[0] !== $word->word[0]) {
            return response()->json(['invalidWord'=>true], 400);
        }

        // check that the word exists
        try {
            Word::where('word', 'LIKE', $guess)->firstOrFail();
        } catch (ModelNotFoundException $e) {
            return response()->json(['unknownWord'=>true], 400);
        }

        // mark correct letters
        $correct = [];
        $contains = [];
        for ($i = 0; $i < strlen($guess); $i++) {
            $letter = $guess[$i];
            if ($word->word[$i] === $letter) {
                $correct []= $i;
            } else if (strpos($word->word, $letter)) {
                $contains []= $i;
            }
        }
        return response()->json([
            'correct' => $correct,
            'contains' => $contains
        ]);

    }

    public function getBonusLetter(Request $request, Word $word, $index) {
        return response()->json(['letter' => $word->word[$index]]);
    }

}
