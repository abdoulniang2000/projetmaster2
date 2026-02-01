<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Cours;
use App\Models\Devoir;
use App\Models\Soumission;
use App\Models\Note;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class StudentController extends Controller
{
    public function cours(Request $request)
    {
        $student = Auth::user();
        
        $query = $student->coursInscrits()
                        ->with(['enseignant', 'matiere', 'module', 'semestre'])
                        ->withCount(['devoirs' => function($q) {
                            $q->where('is_published', true)
                              ->where('date_limite', '>', now());
                        }]);

        if ($request->has('semestre_id')) {
            $query->where('semestre_id', $request->semestre_id);
        }

        if ($request->has('module_id')) {
            $query->where('module_id', $request->module_id);
        }

        return response()->json($query->get());
    }

    public function devoirs(Request $request)
    {
        $student = Auth::user();
        
        // Récupérer les devoirs des cours où l'étudiant est inscrit
        $coursIds = $student->coursInscrits()->pluck('cours.id');
        
        $query = Devoir::whereIn('cours_id', $coursIds)
                      ->with(['cours', 'soumissions' => function($q) use ($student) {
                          $q->where('etudiant_id', $student->id);
                      }])
                      ->where('is_published', true)
                      ->latest();

        // Filtres
        if ($request->has('statut')) {
            switch ($request->statut) {
                case 'a_faire':
                    $query->where('date_limite', '>', now())
                          ->whereDoesntHave('soumissions', function($q) use ($student) {
                              $q->where('etudiant_id', $student->id);
                          });
                    break;
                case 'soumis':
                    $query->whereHas('soumissions', function($q) use ($student) {
                        $q->where('etudiant_id', $student->id);
                    });
                    break;
                case 'en_retard':
                    $query->where('date_limite', '<', now())
                          ->whereDoesntHave('soumissions', function($q) use ($student) {
                              $q->where('etudiant_id', $student->id);
                          });
                    break;
            }
        }

        return response()->json($query->get());
    }

    public function notes(Request $request)
    {
        $student = Auth::user();
        
        $query = $student->soumissions()
                        ->with(['devoir.cours', 'note'])
                        ->whereHas('note')
                        ->latest();

        if ($request->has('cours_id')) {
            $query->whereHas('devoir.cours', function($q) use ($request) {
                $q->where('id', $request->cours_id);
            });
        }

        if ($request->has('semestre_id')) {
            $query->whereHas('devoir.cours', function($q) use ($request) {
                $q->where('semestre_id', $request->semestre_id);
            });
        }

        $notes = $query->get()->map(function($soumission) {
            return [
                'id' => $soumission->note->id,
                'valeur' => $soumission->note->valeur,
                'commentaire' => $soumission->note->commentaire,
                'devoir' => [
                    'id' => $soumission->devoir->id,
                    'titre' => $soumission->devoir->titre,
                    'date_limite' => $soumission->devoir->date_limite,
                    'cours' => [
                        'id' => $soumission->devoir->cours->id,
                        'nom' => $soumission->devoir->cours->nom,
                        'matiere' => $soumission->devoir->cours->matiere->nom ?? null
                    ]
                ],
                'date_soumission' => $soumission->date_soumission,
                'date_notation' => $soumission->note->created_at
            ];
        });

        // Calcul des statistiques
        $stats = [
            'moyenne_generale' => $notes->avg('valeur'),
            'nombre_notes' => $notes->count(),
            'note_max' => $notes->max('valeur'),
            'note_min' => $notes->min('valeur'),
            'par_matiere' => $notes->groupBy('devoir.cours.matiere')->map(function($matiereNotes) {
                return [
                    'moyenne' => $matiereNotes->avg('valeur'),
                    'nombre_notes' => $matiereNotes->count()
                ];
            })
        ];

        return response()->json([
            'notes' => $notes,
            'statistiques' => $stats
        ]);
    }

    public function soumissions(Request $request)
    {
        $student = Auth::user();
        
        $query = $student->soumissions()
                        ->with(['devoir.cours', 'note'])
                        ->latest();

        if ($request->has('devoir_id')) {
            $query->where('devoir_id', $request->devoir_id);
        }

        return response()->json($query->get());
    }

    public function ressources(Request $request)
    {
        $student = Auth::user();
        
        $coursIds = $student->coursInscrits()->pluck('cours.id');
        
        $fichiers = \App\Models\Fichier::whereIn('fichierable_type', ['App\\Models\\Cours'])
                                      ->whereIn('fichierable_id', $coursIds)
                                      ->with(['uploader', 'fichierable'])
                                      ->latest()
                                      ->get();

        return response()->json($fichiers);
    }

    public function statistiques()
    {
        $student = Auth::user();
        
        $coursIds = $student->coursInscrits()->pluck('cours.id');
        
        $stats = [
            'cours_inscrits' => $student->coursInscrits()->count(),
            'devoirs_total' => Devoir::whereIn('cours_id', $coursIds)->where('is_published', true)->count(),
            'devoirs_soumis' => $student->soumissions()->count(),
            'devoirs_en_retard' => Devoir::whereIn('cours_id', $coursIds)
                                       ->where('date_limite', '<', now())
                                       ->where('is_published', true)
                                       ->whereDoesntHave('soumissions', function($q) use ($student) {
                                           $q->where('etudiant_id', $student->id);
                                       })
                                       ->count(),
            'moyenne_generale' => $student->notes()->avg('valeur') ?? 0,
            'dernieres_activites' => $student->soumissions()
                                            ->with('devoir.cours')
                                            ->latest('date_soumission')
                                            ->limit(5)
                                            ->get()
        ];

        return response()->json($stats);
    }
}
