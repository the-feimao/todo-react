<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Todo;
use Carbon\Carbon;
use Illuminate\Support\Facades\Http;

class SendTodoReminders extends Command
{
    // This is how Laravel discovers the command
    protected $signature = 'todos:send-reminders';
    protected $description = 'Send todo reminders via push notifications';

    public function handle()
    {
        $todos = Todo::whereNotNull('remind_at')
            ->where('remind_at', '<=', Carbon::now())
            ->where('completed', false)
            ->where('reminder_sent', false)
            ->with('user')
            ->get();

        foreach ($todos as $todo) {
            if (!$todo->user->expo_push_token) {
                continue;
            }

            // Send push notification
            Http::post('https://exp.host/--/api/v2/push/send', [
                'to' => $todo->user->expo_push_token,
                'title' => 'Todo Reminder ⏰',
                'body' => $todo->title,
                'sound' => 'default',
            ]);

            // Mark reminder as sent
            $todo->update(['reminder_sent' => true]);
        }

        $this->info('Reminders sent successfully!');
    }
}
