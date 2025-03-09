"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import UserService from "@/services/user.service";
import { UserWithRelations } from "@/types/user.type";

function NavBar() {
  const [user, setUser] = useState<UserWithRelations | null>(null);
  const router = useRouter();

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (userId) {
      UserService.fetchUserById(userId)
        .then(data => setUser(data))
        .catch(err => console.error("Erreur lors du chargement de l'utilisateur:", err));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('userId');
    setUser(null);
    router.push('/');
  };

  const getProfileImage = () => {
    if (!user) return '';
    
    switch (user.role) {
      case 'student':
        return user.student?.profilePicture?.url || '';
      case 'company':
        return user.company?.profilePicture?.url || '';
      case 'school':
        return user.school?.profilePicture?.url || '';
      default:
        return user.image || '';
    }
  };

  const getProfileInitial = () => {
    if (!user) return '?';
    
    switch (user.role) {
      case 'student':
        return user.student?.firstName?.[0] || user.name?.[0] || '?';
      case 'company':
        return user.company?.name?.[0] || user.name?.[0] || '?';
      case 'school':
        return user.school?.name?.[0] || user.name?.[0] || '?';
      default:
        return user.name?.[0] || user.email?.[0] || '?';
    }
  };

  return (
    <nav className="border-b">
      <div className="flex h-16 items-center px-4 container mx-auto">
        <Link href="/" className="flex items-center space-x-2">
          <span className="font-bold text-xl">StudentMarket</span>
        </Link>

        <div className="ml-10 flex items-center space-x-4">
          <Link href="/home" className="text-sm font-medium transition-colors hover:text-primary">
            Accueil
          </Link>
          {user?.role === 'student' && (
            <>
              <Link href="/offers" className="text-sm font-medium transition-colors hover:text-primary">
                Offres
              </Link>
            </>
          )}
          {user?.role === 'company' && (
            <>
              <Link href="/students" className="text-sm font-medium transition-colors hover:text-primary">
                Étudiants
              </Link>
              <Link href="/offers" className="text-sm font-medium transition-colors hover:text-primary">
                Offres
              </Link>
            </>
          )}
        </div>

        <div className="ml-auto flex items-center space-x-4">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={getProfileImage()} alt={user.name || 'Avatar'} />
                    <AvatarFallback>{getProfileInitial()}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Link href={`/${user.role}/${user.id}`}>Mon Profil</Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout}>
                  Déconnexion
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button onClick={() => router.push('/auth/signin')} variant="default">
              Connexion
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
