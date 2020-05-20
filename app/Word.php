<?php

namespace App;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

/**
 * App\Word
 *
 * @property int $id
 * @property string $word
 * @property int $length
 * @property int $offer
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Word newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Word newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Word query()
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Word whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Word whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Word whereLength($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Word whereOffer($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Word whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Word whereWord($value)
 * @mixin \Eloquent
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Word gameWords()
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Word length($length)
 */
class Word extends Model
{
    protected $guarded = ['id'];

    protected $casts = [
        'length' => 'integer'
    ];

    // the lowercase ĳ character in Unicode
    const IJ_LIGATURE = "\u{0133}";

    /**
     * Counts the ij ligature as 1 character instead of 2
     * @param $word
     * @return int
     */
    public static function lingoLength($word) {
        return mb_strlen($word);
    }

    /**
     * Performs a multibyte str_shuffle
     * @return string
     */
    public function shuffle() {
        $tmp = preg_split("//u", $this->word, -1, PREG_SPLIT_NO_EMPTY);
        shuffle($tmp);
        return join("", $tmp);
    }

    /**
     * Returns the character at a certain position in a multibyte string
     * @param $index
     */
    public function getLetter($index) {
        $chrArray = preg_split('//u', $this->word, -1, PREG_SPLIT_NO_EMPTY);
        return $chrArray[$index];
    }

    /**
     * @param Builder $query
     * @param $length
     * @return Builder
     */
    public function scopeLength(Builder $query, $length) {
        return $query->where('length', $length);
    }

    /**
     * @param Builder $query
     * @return Builder
     */
    public function scopeGameWords(Builder $query) {
        return $query->where('offer', true);
    }
}
