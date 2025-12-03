<?php
namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Todo;

class TodoController extends Controller
{
    public function index(Request $request)
    {
        $todos = $request->user()->todos()->orderBy('created_at','desc')->get();
        return response()->json($todos);
    }

   public function store(Request $request)
    {
        $data = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'completed' => 'sometimes|boolean',
        ]);

        // Default completed to false if not provided
        if (!isset($data['completed'])) {
            $data['completed'] = false;
        }

        $todo = $request->user()->todos()->create($data);

        return response()->json($todo, 201);
    }


    public function show(Request $request, Todo $todo)
    {
        $this->authorizeTodoOwner($request->user(), $todo);
        return response()->json($todo);
    }

    public function update(Request $request, Todo $todo)
    {
        $this->authorizeTodoOwner($request->user(), $todo);

        $data = $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'completed' => 'boolean',
        ]);

        $todo->update($data);
        return response()->json($todo);
    }

    public function destroy(Request $request, Todo $todo)
    {
        $this->authorizeTodoOwner($request->user(), $todo);
        $todo->delete();
        return response()->json(null, 204);
    }

    protected function authorizeTodoOwner($user, Todo $todo)
    {
        if ($todo->user_id !== $user->id) {
            abort(403, 'Unauthorized');
        }
    }
}
