<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Todo;

class TodoController extends Controller
{
    /**
     * List todos for authenticated user
     */
    public function index(Request $request)
    {
            $query = $request->user()->todos()->with('categories');

        if ($request->filled('priority')) {
            $query->where('priority', $request->priority);
        }

        if ($request->filled('category_id')) {
            $query->whereHas('categories', function ($q) use ($request) {
                $q->where('categories.id', $request->category_id);
            });
        }

        if ($request->filled('due_before')) {
            $query->whereDate('due_at', '<=', $request->due_before);
        }

        if ($request->filled('due_after')) {
            $query->whereDate('due_at', '>=', $request->due_after);
        }

        $todos = $query
            ->orderByRaw("FIELD(priority, 'high', 'medium', 'low')")
            ->orderBy('due_at')
            ->get();
        return response()->json($todos);
    }

    /**
     * Create a new todo
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'title'        => 'required|string|max:255',
            'description'  => 'nullable|string',
            'completed'    => 'sometimes|boolean',
            'due_at'       => 'nullable|date',
            'remind_at'    => 'nullable|date|before_or_equal:due_at',
            'priority'     => 'sometimes|in:low,medium,high',
            'category_ids' => 'sometimes|array',
            'category_ids.*' => 'exists:categories,id',
        ]);

        // Defaults
        $data['completed'] = $data['completed'] ?? false;
        $data['priority']  = $data['priority'] ?? 'medium';

        $todo = $request->user()->todos()->create($data);

        // Attach categories
        if (!empty($data['category_ids'])) {
            $todo->categories()->sync($data['category_ids']);
        }

        return response()->json(
            $todo->load('categories'),
            201
        );
    }

    /**
     * Show single todo
     */
    public function show(Request $request, Todo $todo)
    {
        $this->authorizeTodoOwner($request->user(), $todo);

        return response()->json(
            $todo->load('categories')
        );
    }

    /**
     * Update a todo
     */
    public function update(Request $request, Todo $todo)
    {
        $this->authorizeTodoOwner($request->user(), $todo);

        $data = $request->validate([
            'title'        => 'sometimes|required|string|max:255',
            'description'  => 'nullable|string',
            'completed'    => 'sometimes|boolean',
            'due_at'       => 'nullable|date',
            'remind_at'    => 'nullable|date|before_or_equal:due_at',
            'priority'     => 'sometimes|in:low,medium,high',
            'category_ids' => 'sometimes|array',
            'category_ids.*' => 'exists:categories,id',
        ]);

        $todo->update($data);

        // Sync categories if provided
        if (array_key_exists('category_ids', $data)) {
            $todo->categories()->sync($data['category_ids'] ?? []);
        }

        return response()->json(
            $todo->load('categories')
        );
    }

    /**
     * Delete a todo
     */
    public function destroy(Request $request, Todo $todo)
    {
        $this->authorizeTodoOwner($request->user(), $todo);

        $todo->delete();

        return response()->json(null, 204);
    }

    /**
     * Ownership guard
     */
    protected function authorizeTodoOwner($user, Todo $todo)
    {
        if ($todo->user_id !== $user->id) {
            abort(403, 'Unauthorized');
        }
    }
}
