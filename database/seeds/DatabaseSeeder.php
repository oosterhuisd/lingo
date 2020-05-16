<?php

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        $baseWordsFp = fopen(base_path() .'/database/seeds/Opentaal/OpenTaal-210G-basis-gekeurd.txt', 'r');
        while(!feof($baseWordsFp))  {
            $word = trim(fgets($baseWordsFp));
            if ($this->isValidForLingo($word)) {
                (new \App\Word(['word'=>$word, 'length'=>strlen($word), 'offer'=>true]))->save();
            }
        }

        $flexWordsFp = fopen(base_path() .'/database/seeds/Opentaal/OpenTaal-210G-flexievormen.txt', 'r');
        while(!feof($flexWordsFp))  {
            $word = trim(fgets($flexWordsFp));
            if ($this->isValidForLingo($word)) {
                (new \App\Word(['word'=>$word, 'length'=>strlen($word), 'offer'=>false]))->save();
            }
        }

    }

    /**
     * We consider a word as valid puzzle word if it only contains lowercase letters.
     * @param $word
     */
    private function isValidForLingo($word) {
        return preg_match('#^[a-z]+$#', $word);
    }
}
