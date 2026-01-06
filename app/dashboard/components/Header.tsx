'use client';

import { useAuth } from '@/app/contexts/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { LogOut, User, Settings, Bell, Search, Menu } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export default function Header() {
    const { user, logout } = useAuth();
    const [searchOpen, setSearchOpen] = useState(false);

    return (
        <header className="bg-white/95 backdrop-blur-lg border-b border-gray-200/50 shadow-sm animate-fadeInDown">
            <div className="flex items-center justify-between p-4">
                {/* Barre de recherche */}
                <div className="flex-1 max-w-xl">
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Rechercher des cours, devoirs..."
                            className="input-gradient w-full pl-10 pr-4 py-2 text-sm"
                            onFocus={() => setSearchOpen(true)}
                            onBlur={() => setSearchOpen(false)}
                        />
                        {searchOpen && (
                            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 p-4 z-50 animate-fadeInUp">
                                <p className="text-sm text-gray-500">Commencez à taper pour rechercher...</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Actions à droite */}
                <div className="flex items-center space-x-4">
                    {/* Bouton notifications */}
                    <button className="relative p-2 text-gray-600 hover:text-orange-600 transition-colors duration-200 transform hover:scale-110">
                        <Bell className="h-5 w-5" />
                        <span className="absolute top-1 right-1 w-2 h-2 bg-orange-500 rounded-full animate-pulse"></span>
                    </button>

                    {/* Menu utilisateur */}
                    {user && (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="relative h-10 w-10 rounded-full border-2 border-transparent hover:border-orange-400 transition-all duration-300 transform hover:scale-110">
                                    <Avatar className="h-9 w-9">
                                        <AvatarImage src="/placeholder-user.jpg" alt={`${user.first_name} ${user.last_name}`} />
                                        <AvatarFallback className="bg-gradient-to-br from-orange-400 to-blue-500 text-white font-semibold">
                                            {user.first_name[0]}{user.last_name[0]}
                                        </AvatarFallback>
                                    </Avatar>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-64" align="end" forceMount>
                                <DropdownMenuLabel className="font-normal">
                                    <div className="flex flex-col space-y-2 p-2">
                                        <div className="flex items-center space-x-3">
                                            <Avatar className="h-10 w-10">
                                                <AvatarImage src="/placeholder-user.jpg" alt={`${user.first_name} ${user.last_name}`} />
                                                <AvatarFallback className="bg-gradient-to-br from-orange-400 to-blue-500 text-white font-semibold">
                                                    {user.first_name[0]}{user.last_name[0]}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className="text-sm font-medium text-gray-900">{user.first_name} {user.last_name}</p>
                                                <p className="text-xs text-gray-500">{user.email}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            {user.roles.map((role, index) => (
                                                <span
                                                    key={index}
                                                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${role.name === 'admin'
                                                            ? 'bg-orange-100 text-orange-800'
                                                            : role.name === 'enseignant'
                                                                ? 'bg-blue-100 text-blue-800'
                                                                : 'bg-green-100 text-green-800'
                                                        }`}
                                                >
                                                    {role.name}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem asChild>
                                    <Link href="/dashboard/profil" className="flex items-center cursor-pointer hover:bg-gray-50">
                                        <User className="mr-3 h-4 w-4 text-gray-500" />
                                        <span>Mon profil</span>
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link href="/dashboard/notifications" className="flex items-center cursor-pointer hover:bg-gray-50">
                                        <Bell className="mr-3 h-4 w-4 text-gray-500" />
                                        <span>Notifications</span>
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link href="/dashboard/settings" className="flex items-center cursor-pointer hover:bg-gray-50">
                                        <Settings className="mr-3 h-4 w-4 text-gray-500" />
                                        <span>Paramètres</span>
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                    onClick={logout}
                                    className="flex items-center cursor-pointer hover:bg-red-50 text-red-600"
                                >
                                    <LogOut className="mr-3 h-4 w-4" />
                                    <span>Déconnexion</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}
                </div>
            </div>

            {/* Barre de progression subtile */}
            <div className="h-1 bg-gradient-to-r from-orange-500 via-blue-500 to-green-500 animate-gradient-shift"></div>
        </header>
    );
}
