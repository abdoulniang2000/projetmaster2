<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Cours;
use App\Models\Devoir;
use App\Models\User;
use App\Models\Soumission;
use App\Models\Note;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class TeacherController extends Controller
{
    public function cours(Request $request)
    {
        $teacher = Auth::user();
        
        $query = $teacher->coursEnseignes()
                        ->with(['matiere', 'module', 'semestre', 'etudiantsInscrits'])
                        ->withCount(['devoirs', 'etudiantsInscrits']);

        if ($request->has('semestre_id')) {
            $query->where('semestre_id', $request->semestre_id);
        }

        if ($request->has('module_id')) {
            $query->where('module_id', $request->module_id);
        }

        return response()->json($query->get());
    }

    public function students(Request $request)
    {
        $teacher = Auth::user();
        
        // Récupérer les étudiants des cours de l'enseignant
        $coursIds = $teacher->coursEnseignes()->pluck('id');
        
        $query = User::whereHas('coursInscrits', function($q) use ($coursIds) {
                    $q->whereIn('cours.id', $coursIds);
                })
                ->with(['coursInscrits' => function($q) use ($coursIds) {
                    $q->whereIn('cours.id', $coursIds)
                      ->withPivot('date_inscription', 'statut');
                }])
                ->withCount(['soumissions', 'notes']);

        // Filtres
        if ($request->has('cours_id')) {
            $query->whereHas('coursInscrits', function($q) use ($request) {
                $q->where('cours.id', $request->cours_id);
            });
        }

        if ($request->has('statut')) {
            $query->whereHas('coursInscrits', function($q) use ($request) {
                $q->where('statut', $request->statut);
            });
        }

        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('first_name', 'like', "%{$search}%")
                  ->orWhere('last_name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

        return response()->json($query->get());
    }

    public function validateStudent(Request $request, User $student)
    {
        $teacher = Auth::user();
        
        // Vérifier que l'étudiant est bien inscrit dans un cours de l'enseignant
        $coursCommuns = $teacher->coursEnseignes()
                               ->whereHas('etudiantsInscrits', function($q) use ($student) {
                                   $q->where('users.id', $student->id);
                               })
                               ->get();

        if ($coursCommuns->isEmpty()) {
            return response()->json(['error' => 'Étudiant non trouvé dans vos cours'], 404);
        }

        $request->validate([
            'cours_id' => 'required|exists:cours,id',
            'statut' => 'required|in:actif,suspendu,refuse'
        ]);

        // Vérifier que le cours appartient bien à l'enseignant
        if (!$teacher->coursEnseignes()->where('id', $request->cours_id)->exists()) {
            return response()->json(['error' => 'Cours non trouvé'], 404);
        }

        $student->coursInscrits()->updateExistingPivot($request->cours_id, [
            'statut' => $request->statut,
            'valide_par' => $teacher->id,
            'date_validation' => now()
        ]);

        return response()->json([
            'message' => 'Statut de l\'étudiant mis à jour',
            'student' => $student->load('coursInscrits')
        ]);
    }

    public function devoirsACorriger(Request $request)
    {
        $teacher = Auth::user();
        
        $coursIds = $teacher->coursEnseignes()->pluck('id');
        
        $query = Devoir::whereIn('cours_id', $coursIds)
                      ->with(['cours', 'soumissions' => function($q) {
                          $q->whereDoesntHave('note');
                      }])
                      ->where('is_published', true)
                      ->where('date_limite', '<', now())
                      ->latest();

        return response()->json($query->get());
    }

    public function soumissionsEnAttente(Request $request)
    {
        $teacher = Auth::user();
        
        $coursIds = $teacher->coursEnseignes()->pluck('id');
        
        $query = Soumission::whereHas('devoir.cours', function($q) use ($coursIds) {
                          $q->whereIn('id', $coursIds);
                      })
                      ->with(['etudiant', 'devoir.cours', 'note'])
                      ->whereDoesntHave('note')
                      ->latest();

        if ($request->has('devoir_id')) {
            $query->where('devoir_id', $request->devoir_id);
        }

        return response()->json($query->get());
    }

    public function statistiques()
    {
        $teacher = Auth::user();
        
        $coursIds = $teacher->coursEnseignes()->pluck('id');
        
        $stats = [
            'cours_enseignes' => $teacher->coursEnseignes()->count(),
            'etudiants_total' => User::whereHas('coursInscrits', function($q) use ($coursIds) {
                                     $q->whereIn('cours.id', $coursIds);
                                 })->count(),
            'devoirs_crees' => Devoir::whereIn('cours_id', $coursIds)->count(),
            'soumissions_en_attente' => Soumission::whereHas('devoir.cours', function($q) use ($coursIds) {
                                               $q->whereIn('id', $coursIds);
                                           })->whereDoesntHave('note')->count(),
            'soumissions_corrigees' => Soumission::whereHas('devoir.cours', function($q) use ($coursIds) {
                                               $q->whereIn('id', $coursIds);
                                           })->whereHas('note')->count(),
            'moyenne_generale' => Note::whereHas('soumission.devoir.cours', function($q) use ($coursIds) {
                                      $q->whereIn('id', $coursIds);
                                  })->avg('valeur') ?? 0,
            'taux_rendement' => $this->calculerTauxRendement($coursIds)
        ];

        return response()->json($stats);
    }

    private function calculerTauxRendement($coursIds)
    {
        $totalDevoirs = Devoir::whereIn('cours_id', $coursIds)
                            ->where('is_published', true)
                            ->where('date_limite', '<', now())
                            ->count();

        if ($totalDevoirs === 0) {
            return 0;
        }

        $totalSoumissions = Soumission::whereHas('devoir', function($q) use ($coursIds) {
                                    $q->whereIn('cours_id', $coursIds)
                                      ->where('is_published', true)
                                      ->where('date_limite', '<', now());
                                })->distinct('etudiant_id', 'devoir_id')->count();

        return round(($totalSoumissions / ($totalDevoirs * User::whereHas('coursInscrits', function($q) use ($coursIds) {
            $q->whereIn('cours.id', $coursIds);
        })->count())) * 100, 2);
    }

    public function notesParCours(Request $request)
    {
        $teacher = Auth::user();
        
        $coursIds = $teacher->coursEnseignes()->pluck('id');
        
        $notes = Note::whereHas('soumission.devoir.cours', function($q) use ($coursIds) {
                    $q->whereIn('id', $coursIds);
                })
                ->with(['soumission.etudiant', 'soumission.devoir.cours'])
                ->latest()
                ->get();

        if ($request->has('cours_id')) {
            $notes = $notes->filter(function($note) use ($request) {
                return $note->soumission->devoir->cours_id == $request->cours_id;
            });
        }

        return response()->json($notes);
    }

    public function activitesRecentes()
    {
        $teacher = Auth::user();
        
        $coursIds = $teacher->coursEnseignes()->pluck('id');
        
        $activites = collect();
        
        // Dernières soumissions
        $soumissions = Soumission::whereHas('devoir.cours', function($q) use ($coursIds) {
                               $q->whereIn('id', $coursIds);
                           })
                           ->with(['etudiant', 'devoir.cours'])
                           ->latest('date_soumission')
                           ->limit(10)
                           ->get()
                           ->map(function($soumission) {
                               return [
                                   'type' => 'soumission',
                                   'description' => "{$soumission->etudiant->full_name} a soumis le devoir '{$soumission->devoir->titre}'",
                                   'date' => $soumission->date_soumission,
                                   'data' => $soumission
                               ];
                           });
        
        $activites = $activites->concat($soumissions);
        
        // Dernières notes données
        $notes = Note::whereHas('soumission.devoir.cours', function($q) use ($coursIds) {
                    $q->whereIn('id', $coursIds);
                })
                ->with(['soumission.etudiant', 'soumission.devoir'])
                ->latest()
                ->limit(10)
                ->get()
                ->map(function($note) {
                    return [
                        'type' => 'note',
                        'description' => "Note de {$note->valeur}/20 attribuée à {$note->soumission->etudiant->full_name}",
                        'date' => $note->created_at,
                        'data' => $note
                    ];
                });
        
        $activites = $activites->concat($notes);
        
        return response()->json($activites->sortByDesc('date')->values()->take(20));
    }
}
