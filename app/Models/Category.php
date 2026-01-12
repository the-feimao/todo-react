<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    
    protected $fillable = [
        'name',
        'user_id',
    ];

    public function todos()
    {
        return $this->belongsToMany(Todo::class);
    }
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}