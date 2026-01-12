<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Todo extends Model
{
    use HasFactory;

        protected $fillable = [
            'title',
            'description',
            'completed',
            'user_id',
            'due_at',
            'remind_at',
            'priority'
        ];
       
        protected $casts = [
        'due_at' => 'datetime',
        'remind_at' => 'datetime',
        'completed' => 'boolean',
        ];
         public function user()
        {
            return $this->belongsTo(User::class);
        }
        public function categories()
        {
            return $this->belongsToMany(Category::class);
        }
}
