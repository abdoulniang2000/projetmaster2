<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Statistique;
use App\Models\Activite;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;

class AnalyticsController extends Controller
{
    public function dashboard(Request $request)
    {
        $user = Auth::user();
        
        if ($user->estAdmin()) {
            return $this->adminDashboard();
        } elseif ($user->estEnseignant()) {
            return $this->enseignantDashboard();
        } else {
            return $this->etudiantDashboard();
        }
    }

    private function adminDashboard()
    {
        $stats = [
            'utilisateurs' => [
                'total' => \App\Models\User::count(),
                'actifs' => \App\Models\User::where('status', true)->count(),
                'etudiants' => \App\Models\User::whereHas('roles', fn($q) => $q->where('name', 'etudiant'))->count(),
                'enseignants' => \App\Models\User::whereHas('roles', fn($q) => $q->where('name', 'enseignant'))->count(),
            ],
            'cours' => [
                'total' => \App\Models\Cours::count(),
                'actifs' => \App\Models\Cours::where('is_active', true)->count(),
            ],
            'devoirs' => [
                'total' => \App\Models\Devoir::count(),
                'publies' => \App\Models\Devoir::where('is_published', true)->count(),
            ],
            'soumissions' => [
                'total' => \App\Models\Soumission::count(),
                'en_retard' => \App\Models\Soumission::where('is_late', true)->count(),
            ]
        ];

        $graphiques = [
            'evolution_inscriptions' => $this->getEvolutionInscriptions(),
            'activite_hebdomadaire' => $this->getActiviteHebdomadaire(),
            'performance_par_matiere' => $this->getPerformanceParMatiere(),
            'taux_remise_devoirs' => $this->getTauxRemiseDevoirs(),
        ];

        return response()->json([
            'stats' => $stats,
            'graphiques' => $graphiques
        ]);
    }

    private function enseignantDashboard()
    {
        $enseignantId = Auth::id();
        
        $stats = [
            'cours' => [
                'total' => \App\Models\Cours::where('enseignant_id', $enseignantId)->count(),
                'actifs' => \App\Models\Cours::where('enseignant_id', $enseignantId)->where('is_active', true)->count(),
            ],
            'etudiants' => \App\Models\Cours::where('enseignant_id', $enseignantId)
                ->withCount('etudiantsInscrits')
                ->get()
                ->sum('etudiants_inscrits_count'),
            'devoirs' => [
                'total' => \App\Models\Devoir::whereHas('cours', fn($q) => $q->where('enseignant_id', $enseignantId))->count(),
                'a_corriger' => \App\Models\Soumission::whereHas('devoir.cours', fn($q) => $q->where('enseignant_id', $enseignantId))
                    ->whereDoesntHave('note')->count(),
            ],
            'soumissions' => \App\Models\Soumission::whereHas('devoir.cours', fn($q) => $q->where('enseignant_id', $enseignantId))->count(),
        ];

        $graphiques = [
            'evolution_notes' => $this->getEvolutionNotesEnseignant($enseignantId),
            'activite_cours' => $this->getActiviteCours($enseignantId),
            'taux_participation' => $this->getTauxParticipation($enseignantId),
        ];

        return response()->json([
            'stats' => $stats,
            'graphiques' => $graphiques
        ]);
    }

    private function etudiantDashboard()
    {
        $etudiantId = Auth::id();
        
        $stats = [
            'cours_inscrits' => \App\Models\User::find($etudiantId)->coursInscrits()->count(),
            'devoirs' => [
                'total' => \App\Models\Devoir::whereHas('cours.etudiantsInscrits', fn($q) => $q->where('user_id', $etudiantId))
                    ->publie()->count(),
                'a_rendre' => \App\Models\Devoir::whereHas('cours.etudiantsInscrits', fn($q) => $q->where('user_id', $etudiantId))
                    ->publie()->nonExpire()->count(),
                'en_retard' => \App\Models\Soumission::where('etudiant_id', $etudiantId)->where('is_late', true)->count(),
            ],
            'soumissions' => \App\Models\Soumission::where('etudiant_id', $etudiantId)->count(),
            'notes' => \App\Models\Note::whereHas('soumission', fn($q) => $q->where('etudiant_id', $etudiantId))->count(),
            'moyenne' => \App\Models\Note::whereHas('soumission', fn($q) => $q->where('etudiant_id', $etudiantId))
                ->avg('valeur') ?? 0,
        ];

        $graphiques = [
            'evolution_notes' => $this->getEvolutionNotesEtudiant($etudiantId),
            'activite_recente' => $this->getActiviteRecenteEtudiant($etudiantId),
        ];

        return response()->json([
            'stats' => $stats,
            'graphiques' => $graphiques
        ]);
    }

    private function getEvolutionInscriptions()
    {
        return Statistique::type('inscription')
            ->where('date_stat', '>=', now()->subMonths(6))
            ->orderBy('date_stat')
            ->get()
            ->map(fn($s) => [
                'date' => $s->date_stat->format('Y-m'),
                'valeur' => $s->valeur
            ]);
    }

    private function getActiviteHebdomadaire()
    {
        return Activite::recentes(7)
            ->selectRaw('DATE(date_activite) as date, COUNT(*) as valeur')
            ->groupBy('date')
            ->orderBy('date')
            ->get()
            ->map(fn($a) => [
                'date' => $a->date,
                'valeur' => $a->valeur
            ]);
    }

    private function getPerformanceParMatiere()
    {
        return \App\Models\Matiere::withCount(['cours' => function($q) {
                $q->withCount(['devoirs.soumissions.notes']);
            }])
            ->get()
            ->map(fn($m) => [
                'matiere' => $m->nom,
                'moyenne' => $m->cours->flatMap->devoirs->flatMap->soumissions->flatMap->notes->avg('valeur') ?? 0
            ]);
    }

    private function getTauxRemiseDevoirs()
    {
        return \App\Models\Devoir::withCount('soumissions')
            ->with('cours.etudiantsInscrits')
            ->get()
            ->map(fn($d) => [
                'devoir' => $d->titre,
                'taux' => $d->taux_remise
            ]);
    }

    private function getEvolutionNotesEnseignant($enseignantId)
    {
        return \App\Models\Note::whereHas('soumission.devoir.cours', fn($q) => $q->where('enseignant_id', $enseignantId))
            ->with('soumission.devoir')
            ->get()
            ->groupBy(fn($n) => $n->soumission->devoir->titre)
            ->map(fn($notes, $devoir) => [
                'devoir' => $devoir,
                'moyenne' => $notes->avg('valeur'),
                'count' => $notes->count()
            ]);
    }

    private function getActiviteCours($enseignantId)
    {
        return \App\Models\Cours::where('enseignant_id', $enseignantId)
            ->withCount(['devoirs', 'devoirs.soumissions'])
            ->get()
            ->map(fn($c) => [
                'cours' => $c->nom,
                'devoirs' => $c->devoirs_count,
                'soumissions' => $c->devoirs->sum('soumissions_count')
            ]);
    }

    private function getTauxParticipation($enseignantId)
    {
        return \App\Models\Cours::where('enseignant_id', $enseignantId)
            ->with('etudiantsInscrits')
            ->withCount(['devoirs.soumissions' => fn($q) => $q->distinct('etudiant_id')])
            ->get()
            ->map(fn($c) => [
                'cours' => $c->nom,
                'taux' => $c->etudiantsInscrits->count() > 0 
                    ? round(($c->devoirs_soumissions_count / $c->etudiantsInscrits->count()) * 100, 2)
                    : 0
            ]);
    }

    private function getEvolutionNotesEtudiant($etudiantId)
    {
        return \App\Models\Note::whereHas('soumission', fn($q) => $q->where('etudiant_id', $etudiantId))
            ->with('soumission.devoir')
            ->orderBy('created_at')
            ->get()
            ->map(fn($n) => [
                'date' => $n->created_at->format('Y-m-d'),
                'note' => $n->valeur,
                'devoir' => $n->soumission->devoir->titre
            ]);
    }

    private function getActiviteRecenteEtudiant($etudiantId)
    {
        return Activite::where('user_id', $etudiantId)
            ->recentes(30)
            ->latest()
            ->get()
            ->map(fn($a) => [
                'date' => $a->date_activite->format('Y-m-d H:i'),
                'type' => $a->type,
                'description' => $a->description
            ]);
    }
}
