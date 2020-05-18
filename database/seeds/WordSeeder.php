<?php

use App\Word;
use Illuminate\Database\Seeder;

class WordSeeder extends Seeder
{
    public function run() {
        $baseWordsFp = fopen(base_path() .'/database/seeds/Opentaal/OpenTaal-210G-basis-gekeurd.txt', 'r');
        $this->insertFromFile($baseWordsFp, true);

        $flexWordsFp = fopen(base_path() .'/database/seeds/Opentaal/OpenTaal-210G-flexievormen.txt', 'r');
        $this->insertFromFile($flexWordsFp, false);
    }

    private function prepareWord($word) {
        // replace ij ligature
        $word = preg_replace('/ij/', Word::IJ_LIGATURE, $word);
        return trim($word);
    }

    /**
     * We consider a word as valid puzzle word if it only contains lowercase letters between a-z and ĳ
     * @param $word
     */
    private function isValidForLingo($word) {
        return preg_match('#^[a-z\x{0133}]+$#u', $word);
    }

    /**
     * @param $baseWordsFp
     * @param bool $offerAsSuggestion
     */
    private function insertFromFile($baseWordsFp, $offerAsSuggestion = true) {
        $wordsToInsert = collect();
        while (!feof($baseWordsFp)) {
            $word = $this->prepareWord(fgets($baseWordsFp));
            if ($this->isValidForLingo($word)) {
                $wordsToInsert->push(['word' => $word, 'length' => Word::lingoLength($word), 'offer' => $offerAsSuggestion]);
            }
        }
        $wordsToInsert->chunk(500)->each(function ($words) {
            Word::insert($words->toArray());
        });
    }
}
