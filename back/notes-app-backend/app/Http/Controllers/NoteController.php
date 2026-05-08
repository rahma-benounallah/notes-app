<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Note;

class NoteController extends Controller
{
    // 🔹 GET /api/notes
    // Retourne les notes de l'utilisateur connecté
   public function index(Request $request){
    return $request->user()->notes()->latest()->get();
}

public function store(Request $request){
    $request->validate([
        'title' => 'required|max:100',
        'priority' => 'required'
    ]);

    $note = Note::create([
        'title' => $request->title,
        'content' => $request->input('content'),
        'priority' => $request->priority,
        'user_id' => auth()->id() 
    ]);

    return response()->json($note, 201);
}

public function update(Request $request, $id){
    $note = Note::findOrFail($id);

    $note->update($request->all());

    return $note;
}

public function destroy($id){
    $note = Note::findOrFail($id);
    $note->delete();

    return response()->json(['message' => 'deleted']);
}
}