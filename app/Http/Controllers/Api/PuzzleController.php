<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Word;
use Illuminate\Http\Request;

class PuzzleController extends Controller
{
    /**
     * To prevent users from knowing words by id, we _could_ set up a mapping
     * for words, so each id is only used once.
     * @param Request $request
     * @param int $wordLength
     * @return array
     */
    public function getWord(Request $request, int $wordLength) {
        $word = Word::whereLength($wordLength)->inRandomOrder()->limit(1)->first();
        return [
            'id' => $word->id,
            'letters' => str_shuffle($word->word),
        ];
    }

    public function getLetterPosition(Request $request, Word $word, $letter) {
        $knownPositions = $request->input('knownPositions') ?? [];
        for ($i = 0; $i < strlen($word->word); $i++) {
            if (in_array($i, $knownPositions)) continue;
            if ($word->word[$i] === $letter) {
                return response()->json(['position' => $i]);
            }
        }
        // shouldn't happen
    }

    public function validateWord(Request $request, Word $word)
    {
        $guess = strtolower(trim($request->input('guess')));
        if ($guess === $word->word) {
            return response()->json(['result' => 'correct']);
        }
        return response()->json(['result' => 'incorrect'], 400);
    }
}
