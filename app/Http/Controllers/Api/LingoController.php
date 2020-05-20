<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Word;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use const http\Client\Curl\Features\HTTP2;

class LingoController extends Controller
{

    public function newWord(Request $request, int $wordLength) {
        $word = Word::gameWords()->length($wordLength)->inRandomOrder()->limit(1)->first();
        return [
            'id' => $word->id,
            'length' => $word->length,
            'firstLetter' => $word->word[0],
        ];
    }

    /**
     * @param Request $request
     * @param Word $word
     */
    public function getSolution(Request $request, Word $word) {
        return response()->json(['word'=>$word->word]);
    }

    /**
     * @param Request $request
     * @return JsonResponse
     */
    public function validateGuess(Request $request, Word $word) {
        // do some basic cleanup
        $guess = mb_strtolower(trim($request->input('guess')));

        if ($guess === $word->word) {
            return response()->json(['win'=>true]);
        }

        // the words must be the same length and they have to start with the same letters
        if (Word::lingoLength($guess) !== $word->length || !Str::startsWith($guess, $word->getLetter(0))) {
            Log::debug(Word::lingoLength($request->input('guess')) . " !== $word->length or it does not start with the same letter");
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
        $matchingLetters = '';
        for ($i = 0; $i < Word::lingoLength($guess); $i++) {
            $letter = Str::substr($guess, $i, 1);
            if ($word->getLetter($i) === $letter) {
                $correct []= $i;
                $matchingLetters .= $letter;
            }
        }
        for ($i = 0; $i < Word::lingoLength($guess); $i++) {
            if (in_array($i, $correct)) continue;
            $letter = Str::substr($guess, $i, 1);

            // contains should only contain as many matches of a letter as are actually in the word
            if (Str::contains($word->word, $letter) && Str::substrCount($matchingLetters, $letter) < Str::substrCount($word->word, $letter)) {
                $contains []= $i;
                $matchingLetters .= $letter;
            }
        }

        return response()->json([
            'correct' => $correct,
            'contains' => $contains
        ]);

    }

    public function getBonusLetter(Request $request, Word $word, $index) {
        return response()->json(['letter' => $word->getLetter($index)]);
    }

}
