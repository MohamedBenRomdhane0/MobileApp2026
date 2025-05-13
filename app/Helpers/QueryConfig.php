<?php

namespace App\Helpers;

use Illuminate\Http\Request;

/**
 * Class QueryConfig
 *
 * Encapsulates pagination, sorting, and filtering state from a request.
 */
class QueryConfig
{
    public const SORT_ASC = 'ASC';
    public const SORT_DESC = 'DESC';
    public const DEFAULT_PAGE = 10;
    public const DEFAULT_CURRENT_PAGE = 1;

    private bool $paginated = true;
    private int $perPage = self::DEFAULT_PAGE;
    private int $page = self::DEFAULT_CURRENT_PAGE;
    private array $filters = [];
    private ?string $orderBy = 'id';
    private string $direction = self::SORT_DESC;
    private string $keyword = '';

    /**
     * Create QueryConfig from request input.
     */
    public static function fromRequest(Request $request): static
    {
        return (new static())
            ->setPage((int) $request->input('page', self::DEFAULT_CURRENT_PAGE))
            ->setPerPage((int) $request->input('per_page', self::DEFAULT_PAGE))
            ->setOrderBy($request->input('order_by', 'id'))
            ->setDirection(strtoupper($request->input('direction', self::SORT_DESC)))
            ->setPaginated((bool) $request->input('pagination', true))
            ->setFilters($request->except([
                'page', 'per_page', 'order_by', 'direction', 'pagination', 'keyword'
            ]))
            ->setKeyword($request->input('keyword', ''));
    }

    // ---------- Getters & Setters ----------

    public function getPage(): int { return $this->page; }
    public function setPage(int $page): static { $this->page = $page; return $this; }

    public function getPerPage(): int { return $this->perPage; }
    public function setPerPage(int $perPage): static { $this->perPage = $perPage; return $this; }

    public function getOrderBy(): string { return $this->orderBy; }
    public function setOrderBy(string $orderBy): static { $this->orderBy = $orderBy; return $this; }

    public function getDirection(): string { return $this->direction; }
    public function setDirection(string $direction): static { $this->direction = strtoupper($direction); return $this; }

    public function isPaginated(): bool { return $this->paginated; }
    public function setPaginated(bool $paginated): static { $this->paginated = $paginated; return $this; }

    public function getFilters(): array { return $this->filters; }
    public function setFilters(array $filters): static { $this->filters = $filters; return $this; }

    public function getKeyword(): string { return $this->keyword; }
    public function setKeyword(string $keyword): static { $this->keyword = $keyword; return $this; }
}
