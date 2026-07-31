<?php

namespace Tests\Feature;

use App\Models\DraftUser;
use App\Models\Level;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Tests\TestCase;

class DraftSessionAuthTest extends TestCase
{
    use DatabaseTransactions;

    private function makeDraftUser(array $overrides = []): DraftUser
    {
        $level = Level::create(['name' => 'Test Level ' . uniqid()]);

        return DraftUser::create(array_merge([
            'token'        => bin2hex(random_bytes(20)),
            'level_id'     => $level->id,
            'interactions' => [],
            'ip_address'   => '127.0.0.1',
            'expires_at'   => now()->addDays(30),
        ], $overrides));
    }

    public function test_missing_token_returns_draft_missing(): void
    {
        $response = $this->getJson('/api/draft/session/restore');

        $response->assertStatus(401);
        $response->assertJson(['code' => 'draft_missing']);
    }

    public function test_unknown_token_returns_draft_invalid(): void
    {
        $response = $this->withHeader('Authorization', 'Bearer ' . bin2hex(random_bytes(20)))
            ->getJson('/api/draft/session/restore');

        $response->assertStatus(401);
        $response->assertJson(['code' => 'draft_invalid']);
    }

    public function test_soft_deleted_draft_returns_draft_completed(): void
    {
        $draftUser = $this->makeDraftUser();
        $draftUser->delete();

        $response = $this->withHeader('Authorization', 'Bearer ' . $draftUser->token)
            ->getJson('/api/draft/session/restore');

        $response->assertStatus(401);
        $response->assertJson(['code' => 'draft_completed']);
    }

    public function test_expired_draft_returns_draft_expired(): void
    {
        $draftUser = $this->makeDraftUser(['expires_at' => now()->subDay()]);

        $response = $this->withHeader('Authorization', 'Bearer ' . $draftUser->token)
            ->getJson('/api/draft/session/restore');

        $response->assertStatus(401);
        $response->assertJson(['code' => 'draft_expired']);
    }

    public function test_valid_draft_is_authenticated_and_expiry_slides_forward(): void
    {
        $draftUser = $this->makeDraftUser(['expires_at' => now()->addDay()]);

        $response = $this->withHeader('Authorization', 'Bearer ' . $draftUser->token)
            ->getJson('/api/draft/session/restore');

        $response->assertStatus(200);

        $draftUser->refresh();
        $this->assertTrue($draftUser->expires_at->gt(now()->addDays(28)));
    }
}
