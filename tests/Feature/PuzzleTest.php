<?php

namespace Tests\Feature;

use App\Word;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Mockery\MockInterface;
use Tests\TestCase;

class PuzzleTest extends TestCase
{
    use RefreshDatabase;

    /**
     * @var Word|MockInterface
     */
    private $wordMock;

    protected function setUp(): void
    {
        parent::setUp();
//        $this->wordMock = \Mockery::mock(Word::class);
//        $this->app->instance(Word::class, $this->wordMock);
    }

    /**
     * A basic feature test example.
     *
     * @return void
     */
    public function testProperPositionIsReturned()
    {
        $word = factory(Word::class)->create(['id'=>1, 'word'=>'voorbeeld', 'length'=>9, 'offer'=>true]);

        $response = $this->postJson( '/api/puzzle/getLetterPosition/1/v', ['knownPositions'=>[]]);
        $response->assertJson(['position' => 0]);

        $response = $this->postJson( '/api/puzzle/getLetterPosition/1/o', ['knownPositions'=>[]]);
        $response->assertJson(['position' => 1]);

        $response = $this->postJson( '/api/puzzle/getLetterPosition/1/o', ['knownPositions'=>[1]]);
        $response->assertJson(['position' => 2]);

        $response = $this->postJson( '/api/puzzle/getLetterPosition/1/d', ['knownPositions'=>[1]]);
        $response->assertJson(['position' => 8]);

    }
}
