"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import UserService from "@/services/user.service";
import { UserWithRelations } from "@/types/user.type";

function NavBar() {
  const [user, setUser] = useState<UserWithRelations | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const userId = localStorage.getItem("userId");
        if (!userId) {
          setLoading(false);
          return;
        }
        
        const userData = await UserService.fetchUserById(userId);
        console.log("🔍 Utilisateur chargé:", userData);

        // Si nous n'avons pas d'objet company/student/school mais que nous avons le rôle correspondant,
        // effectuer une requête supplémentaire pour récupérer les détails
        if (userData?.role === "company" && !userData.company) {
          console.log("Tentative de récupération des données d'entreprise pour l'utilisateur:", userData.id);
          try {
            const companies = await fetch('/api/company/filter?userId=' + userData.id).then(res => {
              if (!res.ok) {
                throw new Error('Aucune entreprise trouvée pour cet utilisateur');
              }
              return res.json();
            });
              
            if (companies && companies.length > 0) {
              // Vérifier que l'entreprise appartient bien à l'utilisateur actuel
              const matchingCompany = companies.find((c: any) => c.userId === userData.id);
              if (matchingCompany) {
                userData.company = matchingCompany;
                console.log("Données d'entreprise récupérées avec userId correspondant:", userData.company);
                
                // Récupérer l'image de profil si elle existe
                if (matchingCompany.profilePictureId && userData.company) {
                  try {
                    const profilePicture = await fetch(`/api/uploadFile/${matchingCompany.profilePictureId}`).then(res => {
                      if (!res.ok) {
                        throw new Error('Impossible de récupérer l\'image de profil');
                      }
                      return res.json();
                    });
                    
                    if (profilePicture) {
                      (userData.company as any).profilePicture = profilePicture;
                      console.log("Image de profil de l'entreprise récupérée:", profilePicture);
                    }
                  } catch (error) {
                    console.error("Erreur lors de la récupération de l'image de profil:", error);
                  }
                }
              } else {
                console.warn("⚠️ Entreprise trouvée mais avec un userId différent:", companies[0].userId, "vs", userData.id);
              }
            }
          } catch (err) {
            console.error("Impossible de récupérer les données d'entreprise:", err);
          }
        }

        // Si l'utilisateur est un étudiant mais que nous n'avons pas ses données, les récupérer
        if (userData?.role === "student" && !userData.student) {
          console.log("Tentative de récupération des données d'étudiant pour l'utilisateur:", userData.id);
          try {
            const students = await fetch('/api/student/filter?userId=' + userData.id).then(res => {
              if (!res.ok) {
                throw new Error('Aucun étudiant trouvé pour cet utilisateur');
              }
              return res.json();
            });
              
            if (students && students.length > 0) {
              // Vérifier que l'étudiant appartient bien à l'utilisateur actuel
              const matchingStudent = students.find((s: any) => s.userId === userData.id);
              if (matchingStudent) {
                userData.student = matchingStudent;
                console.log("Données d'étudiant récupérées avec userId correspondant:", userData.student);
                
                // Récupérer l'image de profil si elle existe
                if (matchingStudent.profilePictureId && userData.student) {
                  try {
                    const profilePicture = await fetch(`/api/uploadFile/${matchingStudent.profilePictureId}`).then(res => {
                      if (!res.ok) {
                        throw new Error('Impossible de récupérer l\'image de profil');
                      }
                      return res.json();
                    });
                    
                    if (profilePicture) {
                      // Utiliser une affectation avec "as any" pour éviter l'erreur de type
                      (userData.student as any).profilePicture = profilePicture;
                      console.log("Image de profil récupérée:", profilePicture);
                    }
                  } catch (error) {
                    console.error("Erreur lors de la récupération de l'image de profil:", error);
                  }
                }
                
                // Récupérer le CV si il existe
                if (matchingStudent.CVId && userData.student) {
                  try {
                    const CV = await fetch(`/api/uploadFile/${matchingStudent.CVId}`).then(res => {
                      if (!res.ok) {
                        throw new Error('Impossible de récupérer le CV');
                      }
                      return res.json();
                    });
                    
                    if (CV) {
                      // Utiliser une affectation avec "as any" pour éviter l'erreur de type
                      (userData.student as any).CV = CV;
                      console.log("CV récupéré:", CV);
                    }
                  } catch (error) {
                    console.error("Erreur lors de la récupération du CV:", error);
                  }
                }
              } else {
                console.warn("⚠️ Étudiant trouvé mais avec un userId différent:", students[0].userId, "vs", userData.id);
              }
            }
          } catch (err) {
            console.error("Impossible de récupérer les données d'étudiant:", err);
          }
        }

        // Si l'utilisateur est une école mais que nous n'avons pas ses données, les récupérer
        if (userData?.role === "school" && !userData.school) {
          console.log("Tentative de récupération des données d'école pour l'utilisateur:", userData.id);
          try {
            // La route filter n'existe pas pour les écoles, utiliser la route principale
            const schools = await fetch('/api/school').then(res => {
              if (!res.ok) {
                throw new Error('Impossible de récupérer les écoles');
              }
              return res.json();
            });
              
            if (schools && schools.length > 0) {
              // Filtrer manuellement pour trouver l'école correspondant à l'utilisateur
              const matchingSchool = schools.find((s: any) => s.userId === userData.id);
              if (matchingSchool) {
                userData.school = matchingSchool;
                console.log("Données d'école récupérées avec userId correspondant:", userData.school);
                
                // Récupérer l'image de profil si elle existe
                if (matchingSchool.profilePictureId && userData.school) {
                  try {
                    const profilePicture = await fetch(`/api/uploadFile/${matchingSchool.profilePictureId}`).then(res => {
                      if (!res.ok) {
                        throw new Error('Impossible de récupérer l\'image de profil');
                      }
                      return res.json();
                    });
                    
                    if (profilePicture) {
                      (userData.school as any).profilePicture = profilePicture;
                      console.log("Image de profil de l'école récupérée:", profilePicture);
                    }
                  } catch (error) {
                    console.error("Erreur lors de la récupération de l'image de profil:", error);
                  }
                }
              } else {
                console.warn("⚠️ Aucune école trouvée pour l'utilisateur:", userData.id);
              }
            }
          } catch (err) {
            console.error("Impossible de récupérer les données d'école:", err);
          }
        }

        setUser(userData);
      } catch (err) {
        console.error("Erreur lors du chargement de l'utilisateur:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleLogout = async () => {
    localStorage.removeItem("userId");
    document.cookie =
      "user-email=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    setUser(null);
    router.push("/");
  };

  // Fonction pour récupérer une image directement en base64 ou en Data URL
  const getDirectProfileImage = async (fileId: string): Promise<string> => {
    try {
      const response = await fetch(`/api/uploadFile/${fileId}/content`);
      if (!response.ok) {
        throw new Error('Impossible de récupérer le contenu de l\'image');
      }
      
      // Si l'API renvoie directement un blob ou une image
      const blob = await response.blob();
      return URL.createObjectURL(blob);
    } catch (error) {
      console.warn("Erreur lors de la récupération directe de l'image:", error);
      return '/default-avatar.png'; // Image par défaut
    }
  };

  // Fonction pour vérifier si l'URL de l'image est valide
  const getProfileImage = () => {
    try {
      if (!user) return "/default-avatar.png";

      let url = "";
      switch (user.role) {
        case "student":
          // Utiliser directement l'URL de l'image si disponible
          if (user.student?.profilePicture?.url) {
            url = user.student.profilePicture.url;
          } 
          // Sinon, utiliser l'URL de base pour les fichiers
          else if (user.student?.profilePictureId) {
            url = `/api/uploadFile/${user.student.profilePictureId}`;
          }
          break;
        case "company":
          if (user.company?.profilePicture?.url) {
            url = user.company.profilePicture.url;
          } 
          else if (user.company?.profilePictureId) {
            url = `/api/uploadFile/${user.company.profilePictureId}`;
          }
          break;
        case "school":
          if (user.school?.profilePicture?.url) {
            url = user.school.profilePicture.url;
          } 
          else if (user.school?.profilePictureId) {
            url = `/api/uploadFile/${user.school.profilePictureId}`;
          }
          break;
        case "admin":
          url = user.image || "";
          break;
        default:
          url = user.image || "";
      }

      // Si l'URL est vide, retourner l'image par défaut
      if (!url) return "/default-avatar.png";
      
      return url;
    } catch (error) {
      console.warn("Erreur lors de la récupération de l'URL d'image:", error);
      return "/default-avatar.png";
    }
  };

  const getProfileInitial = () => {
    if (!user) return "?";

    switch (user.role) {
      case "student":
        return user.student?.firstName?.[0] || user.name?.[0] || "?";
      case "company":
        return user.company?.name?.[0] || user.name?.[0] || "?";
      case "school":
        return user.school?.name?.[0] || user.name?.[0] || "?";
      case "admin":
        return user.name?.[0] || user.email?.[0] || "?";
      default:
        return user.name?.[0] || user.email?.[0] || "?";
    }
  };

  // Fonctions pour vérifier si les IDs existent avant de construire les liens
  const getCompanyProfileLink = () => {
    // Si l'utilisateur a un rôle d'entreprise mais pas d'ID d'entreprise, essayer de le récupérer depuis l'API
    if (user?.role === "company") {
      // Si nous avons déjà l'objet company chargé, utilisez son ID
      if (user.company?.id) {
        return `/company/${user.company.id}`;
      }
      
      // Si nous n'avons pas de company, nous devons rediriger vers une page de création d'entreprise
      // ou une page d'erreur qui explique le problème
      return "/company/create";
    }
    return "/";
  };

  const getStudentProfileLink = () => {
    if (user?.role === "student") {
      if (user.student?.id) {
        return `/student/${user.student.id}`;
      }
      return "/student/create";
    }
    return "/";
  };

  const getSchoolProfileLink = () => {
    if (user?.role === "school") {
      if (user.school?.id) {
        return `/school/${user.school.id}`;
      }
      return "/school/create";
    }
    return "/";
  };

  // Fonction pour déterminer si un utilisateur a accès aux fonctionnalités d'entreprise
  const hasCompanyRole = () => {
    return user?.role === "company";
  };

  // Fonction pour déterminer si un utilisateur a accès aux fonctionnalités d'étudiant
  const hasStudentRole = () => {
    return user?.role === "student";
  };

  // Fonction pour déterminer si un utilisateur a accès aux fonctionnalités d'école
  const hasSchoolRole = () => {
    return user?.role === "school";
  };

  // Fonction pour déterminer si un utilisateur a accès aux fonctionnalités d'administrateur
  const hasAdminRole = () => {
    return user?.role === "admin";
  };

  // Fonction pour afficher le composant d'avertissement si nous n'avons pas d'ID pour l'entité
  const ProfileWarning = () => {
    if (hasCompanyRole() && !user?.company?.id) {
      return (
        <DropdownMenuItem className="text-red-500">
          Configuration d'entreprise requise
        </DropdownMenuItem>
      );
    }
    if (hasStudentRole() && !user?.student?.id) {
      return (
        <DropdownMenuItem className="text-red-500">
          Configuration d'étudiant requise
        </DropdownMenuItem>
      );
    }
    if (hasSchoolRole() && !user?.school?.id) {
      return (
        <DropdownMenuItem className="text-red-500">
          Configuration d'école requise
        </DropdownMenuItem>
      );
    }
    if (hasAdminRole() && !user?.role) {
      return (
        <DropdownMenuItem className="text-red-500">
          Configuration d'administrateur requise
        </DropdownMenuItem>
      );
    }
    return null;
  };

  return (
    <nav className="border-b">
      <div className="flex h-16 items-center px-4 container mx-auto">
        <Link href="/" className="flex items-center space-x-2">
          <span className="font-bold text-xl">StudentMarket</span>
        </Link>

        <div className="ml-10 flex items-center space-x-4">
          <Link
            href="/home"
            className="text-sm font-medium transition-colors hover:text-primary"
          >
            Accueil
          </Link>
        </div>

        <div className="ml-auto flex items-center space-x-4">
          {loading ? (
            <div className="h-8 w-8 rounded-full bg-gray-200 animate-pulse"></div>
          ) : user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-8 w-8 rounded-full"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage 
                      className="object-cover w-full h-full"
                      src={getProfileImage()}
                      alt={user.name || "Avatar"}
                      width={32}
                      height={32}
                    />
                    <AvatarFallback>{getProfileInitial()}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  {hasCompanyRole() && (
                      <Link href={getCompanyProfileLink()}>
                        Mon Profil
                      </Link>
                  )}
                  {hasStudentRole() && (
                    <Link href={getStudentProfileLink()}>
                      Mon Profil
                    </Link>
                  )}
                  {hasSchoolRole() && (
                    <Link href={getSchoolProfileLink()}>
                      Mon Profil
                    </Link>
                  )}
                </DropdownMenuItem>
                {hasCompanyRole() && (
                  <>  
                    <DropdownMenuItem>
                      <Link href={`${getCompanyProfileLink()}/offers`}>
                        Mes offres
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Link href={`${getCompanyProfileLink()}/reviews`}>
                        Mes évaluations
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Link href={`${getCompanyProfileLink()}/settings`}>
                        Paramètres
                      </Link>
                    </DropdownMenuItem>
                  </>
                )}
                {hasStudentRole() && (
                  <>
                    <DropdownMenuItem>
                      <Link href={`student/applications`}>
                        Mes candidatures
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Link href={`${getStudentProfileLink()}/settings`}>
                        Paramètres
                      </Link>
                      </DropdownMenuItem>
                  </>
                )}
                {hasAdminRole() && (
                  <>
                    <DropdownMenuItem>
                      <Link href={`admin/dashboard`}>
                        Paramètres
                      </Link>
                    </DropdownMenuItem>
                  </>
                )}
                

                <ProfileWarning />
                <DropdownMenuItem onClick={handleLogout}>
                  Déconnexion
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              onClick={() => router.push("/auth/signin")}
              variant="default"
            >
              Connexion
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
