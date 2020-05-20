<?php

namespace Tests\Feature;

use App\Word;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Mockery\MockInterface;
use Tests\TestCase;

class LingoTest extends TestCase
{
    use RefreshDatabase;

    /**
     * @var Word|MockInterface
     */
    private $wordMock;

    protected function setUp(): void
    {
        parent::setUp();
    }

    /**
     * @test
     */
    public function containedLettersAreProperlyReturned()
    {
        factory(Word::class)->create(['id'=>1, 'word'=>'abbcd', 'length'=>5, 'offer'=>true]);
        factory(Word::class)->create(['id'=>2, 'word'=>'abcde', 'length'=>5, 'offer'=>true]);
        factory(Word::class)->create(['id'=>3, 'word'=>'accbb', 'length'=>5, 'offer'=>true]);
        factory(Word::class)->create(['id'=>4, 'word'=>'azzza', 'length'=>5, 'offer'=>true]);

        $response = $this->postJson('/api/lingo/validate/1', ['guess' => 'abcde']);
        $response->assertJson(['correct' => [0, 1], 'contains' => [2, 3]]);

        // only the first c should be in contains, but both b's should be
        $response = $this->postJson('/api/lingo/validate/1', ['guess' => 'accbb']);
        $response->assertJson(['correct' => [0], 'contains' => [1, 3, 4]]);

        // a should not be in contains
        $response = $this->postJson('/api/lingo/validate/1', ['guess' => 'azzza']);
        $response->assertJson(['correct' => [0], 'contains' => []]);
    }

    /**
     * @test
     */
    public function nonExistingWordsAreRejected()
    {
        factory(Word::class)->create(['id'=>1, 'word'=>'abcde', 'length'=>5, 'offer'=>true]);

        $response = $this->postJson( '/api/lingo/validate/1', ['guess'=>'abbbb']);
        $response->assertJson(['unknownWord' => true])->assertStatus(400);
    }

    /**
     * @test
     */
    public function wordsWithWrongStartingLetterAreRejected()
    {
        factory(Word::class)->create(['id'=>1, 'word'=>'abcde', 'length'=>5, 'offer'=>true]);
        factory(Word::class)->create(['id'=>2, 'word'=>'edcba', 'length'=>5, 'offer'=>true]);

        $response = $this->postJson( '/api/lingo/validate/1', ['guess'=>'edcba']);
        $response->assertJson(['invalidWord' => true])->assertStatus(400);
    }

    /**
     * @test
     */
    public function multibyteCharactersAreProperlyCompared()
    {
        factory(Word::class)->create(['id'=>1, 'word'=>'bĳzet', 'length'=>5, 'offer'=>true]);
        factory(Word::class)->create(['id'=>2, 'word'=>'beval', 'length'=>5, 'offer'=>true]);

        $response = $this->postJson( '/api/lingo/validate/1', ['guess'=>'beval']);
        $response->assertJson(['correct'=>[0], 'contains'=>[1]])->assertStatus(200);

        $response = $this->postJson( '/api/lingo/validate/2', ['guess'=>'bĳzet']);
        $response->assertJson(['correct'=>[0], 'contains'=>[3]])->assertStatus(200);
    }


}
