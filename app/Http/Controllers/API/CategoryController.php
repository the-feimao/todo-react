<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Category;

class CategoryController extends Controller
{
    /**
     * List categories for authenticated user
     */
    public function index(Request $request)
    {
        
        return response()->json(
            $request->user()->categories()->orderBy('name')->get()
            
        );
    }

    /**
     * Create a category
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:100'
        ]);

        $category = $request->user()->categories()->create($data);

        return response()->json($category, 201);
    }

    /**
     * Update a category
     */
    public function update(Request $request, Category $category)
    {
        $this->authorizeOwner($request->user(), $category);

        $data = $request->validate([
            'name' => 'required|string|max:100'
        ]);

        $category->update($data);

        return response()->json($category);
    }

    /**
     * Delete a category
     */
    public function destroy(Request $request, Category $category)
    {
        $this->authorizeOwner($request->user(), $category);

        $category->delete();

        return response()->json(null, 204);
    }

    protected function authorizeOwner($user, Category $category)
    {
        if ($category->user_id !== $user->id) {
            abort(403, 'Unauthorized');
        }
    }
}
