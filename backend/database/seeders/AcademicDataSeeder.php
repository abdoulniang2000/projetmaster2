<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Semestre;
use App\Models\Departement;
use App\Models\Matiere;

class AcademicDataSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Créer les semestres
        $semestres = [
            ['nom' => 'Licence 1 - Semestre 1', 'description' => 'Premier semestre de Licence 1', 'date_debut' => '2025-09-01', 'date_fin' => '2026-01-31'],
            ['nom' => 'Licence 1 - Semestre 2', 'description' => 'Deuxième semestre de Licence 1', 'date_debut' => '2026-02-01', 'date_fin' => '2026-06-30'],
            ['nom' => 'Licence 2 - Semestre 1', 'description' => 'Premier semestre de Licence 2', 'date_debut' => '2025-09-01', 'date_fin' => '2026-01-31'],
            ['nom' => 'Licence 2 - Semestre 2', 'description' => 'Deuxième semestre de Licence 2', 'date_debut' => '2026-02-01', 'date_fin' => '2026-06-30'],
            ['nom' => 'Licence 3 - Semestre 1', 'description' => 'Premier semestre de Licence 3', 'date_debut' => '2025-09-01', 'date_fin' => '2026-01-31'],
            ['nom' => 'Licence 3 - Semestre 2', 'description' => 'Deuxième semestre de Licence 3', 'date_debut' => '2026-02-01', 'date_fin' => '2026-06-30'],
        ];

        foreach ($semestres as $semestre) {
            Semestre::create($semestre);
        }

        // Créer les départements
        $departements = [
            ['nom' => 'Informatique', 'description' => 'Département d\'Informatique', 'code' => 'INFO'],
            ['nom' => 'Mathématiques', 'description' => 'Département de Mathématiques', 'code' => 'MATH'],
            ['nom' => 'Physique', 'description' => 'Département de Physique', 'code' => 'PHYS'],
            ['nom' => 'Chimie', 'description' => 'Département de Chimie', 'code' => 'CHIM'],
            ['nom' => 'Sciences Économiques', 'description' => 'Département de Sciences Économiques', 'code' => 'ECON'],
        ];

        foreach ($departements as $departement) {
            Departement::create($departement);
        }

        // Créer les matières
        $matieres = [
            ['nom' => 'Algorithmique et Programmation', 'description' => 'Introduction aux algorithmes et à la programmation', 'code' => 'ALGO101', 'departement_id' => 1],
            ['nom' => 'Structures de Données', 'description' => 'Étude des structures de données avancées', 'code' => 'SD102', 'departement_id' => 1],
            ['nom' => 'Base de Données', 'description' => 'Conception et gestion des bases de données', 'code' => 'BD103', 'departement_id' => 1],
            ['nom' => 'Développement Web', 'description' => 'Technologies de développement web', 'code' => 'WEB104', 'departement_id' => 1],
            ['nom' => 'Algèbre Linéaire', 'description' => 'Algèbre linéaire et applications', 'code' => 'ALG201', 'departement_id' => 2],
            ['nom' => 'Calcul Différentiel', 'description' => 'Calcul différentiel et intégral', 'code' => 'CAL202', 'departement_id' => 2],
            ['nom' => 'Mécanique Quantique', 'description' => 'Introduction à la mécanique quantique', 'code' => 'MQ301', 'departement_id' => 3],
            ['nom' => 'Thermodynamique', 'description' => 'Principes de thermodynamique', 'code' => 'TD302', 'departement_id' => 3],
            ['nom' => 'Chimie Organique', 'description' => 'Introduction à la chimie organique', 'code' => 'CO401', 'departement_id' => 4],
            ['nom' => 'Microéconomie', 'description' => 'Principes de microéconomie', 'code' => 'MIC501', 'departement_id' => 5],
        ];

        foreach ($matieres as $matiere) {
            Matiere::create($matiere);
        }
    }
}
