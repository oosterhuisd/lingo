<?php

namespace App;

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
 */
class Word extends Model
{
    protected $guarded = ['id'];

    // the lowercase ĳ character in Unicode
    const IJ_LIGATURE = "\u{0133}";

    /**
     * Counts the IJ ligature as 1 character instead of 2
     * @param $word
     * @return int
     */
    public static function lingoLength($word) {
        return strlen($word) - substr_count(strtolower($word), static::IJ_LIGATURE);
    }
}
