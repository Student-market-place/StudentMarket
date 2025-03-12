# Data Transfer Objects (DTOs)

Ce dossier contient tous les DTOs (Data Transfer Objects) utilisés dans l'application Student Market. Les DTOs sont des objets qui définissent comment les données sont transférées entre le client et le serveur, ce qui aide à garantir la sécurité, la validation et la cohérence des données.

## Structure

Chaque modèle de données possède généralement quatre types de DTOs:

1. **CreateDTO** - Définit les champs requis pour créer une nouvelle instance
2. **UpdateDTO** - Définit les champs qui peuvent être mis à jour
3. **ResponseDTO** - Définit la structure des données renvoyées au client
4. **SearchDTO** - Définit les paramètres de recherche/filtrage

## Liste des DTOs

- **User** - Utilisateurs du système
- **Student** - Étudiants inscrits sur la plateforme
- **Company** - Entreprises offrant des stages/alternances
- **School** - Écoles partenaires du système
- **CompanyOffer** - Offres de stage/alternance publiées par les entreprises
- **StudentApply** - Candidatures des étudiants aux offres
- **StudentHistory** - Historique des expériences professionnelles des étudiants
- **Review** - Avis des entreprises sur les étudiants
- **Skill** - Compétences associées aux étudiants et aux offres
- **UploadFile** - Fichiers uploadés (CV, photos de profil, etc.)

## Utilisation

Les DTOs sont importés dans les services et les contrôleurs pour:

```typescript
import { CreateStudentDto, StudentResponseDto } from '@/types/dto';

// Exemple de création d'un étudiant
async function createStudent(data: CreateStudentDto): Promise<StudentResponseDto> {
  // Logique de création...
}

// Exemple de recherche d'étudiants
async function searchStudents(filters: StudentSearchDto): Promise<StudentResponseDto[]> {
  // Logique de recherche...
}
```

## Avantages des DTOs

1. **Sécurité** - Limitation des données exposées à l'API
2. **Validation** - Structure clairement définie pour la validation des données
3. **Documentation** - Documentation implicite de la structure des données
4. **Séparation des préoccupations** - Séparation entre les modèles de base de données et les interfaces externes 