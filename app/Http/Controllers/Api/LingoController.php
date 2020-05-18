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
    public function validateWord(Request $request) {
        $word = Word::find($request->input('id'));

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
        for ($i = 0; $i < Word::lingoLength($guess); $i++) {
            $letter = Str::substr($guess, $i, 1);
            if ($word->getLetter($i) === $letter) {
                $correct []= $i;
            } else if (Str::contains($word->word, $letter)) {
                $contains []= $i;
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
