import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Edit, Trash2, Clock, DollarSign, User, Image as ImageIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useState, useMemo } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function ServiceList({ services, onEdit, onDelete, loading, viewMode = 'grid' }) {
    const [imageErrors, setImageErrors] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(6);

    const handleDeleteClick = async (id) => {
        await onDelete(id);
    };

    // Helper function to get image URL
    const getImageUrl = (imagePath) => {
        if (!imagePath) return null;
        return `${import.meta.env.VITE_BACKEND_URL}/storage/${imagePath}`;
    };

    const handleImageError = (serviceId) => {
        setImageErrors(prev => ({ ...prev, [serviceId]: true }));
    };

    // Pagination logic
    const totalItems = services.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    
    const paginatedServices = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return services.slice(startIndex, startIndex + itemsPerPage);
    }, [services, currentPage, itemsPerPage]);

    // Reset to first page when services change
    const handleItemsPerPageChange = (value) => {
        setItemsPerPage(parseInt(value));
        setCurrentPage(1);
    };

    const goToPage = (page) => {
        setCurrentPage(Math.max(1, Math.min(page, totalPages)));
    };

    // Generate page numbers array
    const getPageNumbers = () => {
        const pageNumbers = [];
        const maxVisiblePages = 5;
        
        if (totalPages <= maxVisiblePages) {
            for (let i = 1; i <= totalPages; i++) {
                pageNumbers.push(i);
            }
        } else {
            const startPage = Math.max(1, currentPage - 2);
            const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
            
            for (let i = startPage; i <= endPage; i++) {
                pageNumbers.push(i);
            }
        }
        
        return pageNumbers;
    };

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, i) => (
                        <Card key={i} className="animate-pulse border-0 shadow-lg bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl">
                            <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded-t-2xl"></div>
                            <CardContent className="p-6">
                                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
                                <div className="flex gap-2">
                                    <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded flex-1"></div>
                                    <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded flex-1"></div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        );
    }

    if (services.length === 0) {
        return (
            <Card className="border-0 shadow-xl bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl">
                <CardContent className="p-12 text-center">
                    <ImageIcon className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Aucun service trouvé</h3>
                    <p className="text-gray-600 dark:text-gray-400">Commencez par ajouter votre premier service pour attirer des clients.</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-6">
            {/* Pagination Controls Top */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                        Afficher
                    </span>
                    <Select value={itemsPerPage.toString()} onValueChange={handleItemsPerPageChange}>
                        <SelectTrigger className="w-20 h-8">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="6">6</SelectItem>
                            <SelectItem value="9">9</SelectItem>
                            <SelectItem value="12">12</SelectItem>
                            <SelectItem value="18">18</SelectItem>
                        </SelectContent>
                    </Select>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                        sur {totalItems} services
                    </span>
                </div>

                <div className="text-sm text-gray-600 dark:text-gray-400">
                    Page {currentPage} sur {totalPages}
                </div>
            </div>

            {/* Services Grid/List */}
            {viewMode === 'list' ? (
                <div className="space-y-4">
                    {paginatedServices.map(service => (
                        <Card key={service.id} className="border-0 shadow-lg bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300">
                            <CardContent className="p-6">
                                <div className="flex items-center gap-6">
                                    <div className="relative">
                                        <Avatar className="w-20 h-20 rounded-xl">
                                            <AvatarImage 
                                                src={getImageUrl(service.image)}
                                                alt={service.name}
                                                className="object-cover rounded-xl"
                                            />
                                            <AvatarFallback className="rounded-xl bg-gradient-to-r from-emerald-500 to-blue-500 text-white text-lg font-bold">
                                                {service.name.charAt(0).toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                    </div>
                                    
                                    <div className="flex-1 space-y-2">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <h3 className="text-xl font-bold text-gray-900 dark:text-white">{service.name}</h3>
                                                <p className="text-gray-600 dark:text-gray-400 mt-1">{service.description}</p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    onClick={() => onEdit(service)}
                                                    className="h-9 w-9 rounded-xl hover:bg-emerald-50 hover:border-emerald-200 hover:text-emerald-600 transition-all duration-300"
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                <AlertDialog>
                                                    <AlertDialogTrigger asChild>
                                                        <Button
                                                            variant="outline"
                                                            size="icon"
                                                            className="h-9 w-9 rounded-xl hover:bg-red-50 hover:border-red-200 hover:text-red-600 transition-all duration-300"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent>
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
                                                            <AlertDialogDescription>
                                                                Cette action ne peut pas être annulée. Cela supprimera définitivement le service.
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel>Annuler</AlertDialogCancel>
                                                            <AlertDialogAction
                                                                onClick={() => handleDeleteClick(service.id)}
                                                                className="bg-red-600 hover:bg-red-700"
                                                            >
                                                                Supprimer
                                                            </AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                            </div>
                                        </div>
                                        
                                        <div className="flex items-center gap-4">
                                            <Badge variant="secondary" className="px-3 py-1">
                                                <DollarSign className="w-3 h-3 mr-1" />
                                                {service.price} MAD
                                            </Badge>
                                            <Badge variant="outline" className="px-3 py-1">
                                                <Clock className="w-3 h-3 mr-1" />
                                                {service.duration} min
                                            </Badge>
                                            {service.barber && (
                                                <Badge variant="outline" className="px-3 py-1">
                                                    <User className="w-3 h-3 mr-1" />
                                                    {service.barber.name}
                                                </Badge>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {paginatedServices.map(service => (
                        <Card key={service.id} className="border-0 shadow-lg bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 group">
                            <div className="relative h-48 overflow-hidden">
                                {service.image && !imageErrors[service.id] ? (
                                    <img
                                        src={getImageUrl(service.image)}
                                        alt={service.name}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                        onError={() => handleImageError(service.id)}
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gradient-to-br from-emerald-500 to-blue-500 flex items-center justify-center">
                                        <div className="text-center">
                                            <ImageIcon className="w-16 h-16 text-white opacity-50 mx-auto mb-2" />
                                            <span className="text-white text-sm font-medium opacity-75">{service.name}</span>
                                        </div>
                                    </div>
                                )}
                                
                                {/* Boutons d'action */}
                                <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <Button
                                        variant="secondary"
                                        size="icon"
                                        onClick={() => onEdit(service)}
                                        className="h-8 w-8 rounded-full bg-white/90 hover:bg-white shadow-lg"
                                    >
                                        <Edit className="h-3 w-3" />
                                    </Button>
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button
                                                variant="secondary"
                                                size="icon"
                                                className="h-8 w-8 rounded-full bg-white/90 hover:bg-white shadow-lg"
                                            >
                                                <Trash2 className="h-3 w-3 text-red-600" />
                                            </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    Cette action ne peut pas être annulée. Cela supprimera définitivement le service "{service.name}".
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>Annuler</AlertDialogCancel>
                                                <AlertDialogAction
                                                    onClick={() => handleDeleteClick(service.id)}
                                                    className="bg-red-600 hover:bg-red-700"
                                                >
                                                    Supprimer
                                                </AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </div>
                            </div>
                            
                            <CardContent className="p-6 space-y-4">
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{service.name}</h3>
                                    <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2">{service.description}</p>
                                </div>
                                
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <Badge className="bg-emerald-500 hover:bg-emerald-600 text-white px-3 py-1">
                                            <DollarSign className="w-3 h-3 mr-1" />
                                            {service.price} MAD
                                        </Badge>
                                        <Badge variant="outline" className="px-3 py-1">
                                            <Clock className="w-3 h-3 mr-1" />
                                            {service.duration}min
                                        </Badge>
                                    </div>
                                </div>
                                
                                {service.barber && (
                                    <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                                        <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                                            <User className="w-3 h-3" />
                                            Barber: {service.barber.name}
                                        </p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {/* Pagination Controls Bottom */}
            {totalPages > 1 && (
                <Card className="border-0 shadow-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                    <CardContent className="p-4">
                        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                                Affichage de {((currentPage - 1) * itemsPerPage) + 1} à {Math.min(currentPage * itemsPerPage, totalItems)} sur {totalItems} services
                            </div>
                            
                            <div className="flex items-center gap-2">
                                {/* Previous Button */}
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => goToPage(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className="h-9 w-9 rounded-xl"
                                >
                                    <ChevronLeft className="h-4 w-4" />
                                </Button>

                                {/* Page Numbers */}
                                <div className="flex items-center gap-1">
                                    {getPageNumbers().map(pageNum => (
                                        <Button
                                            key={pageNum}
                                            variant={currentPage === pageNum ? "default" : "outline"}
                                            size="icon"
                                            onClick={() => goToPage(pageNum)}
                                            className={`h-9 w-9 rounded-xl ${
                                                currentPage === pageNum 
                                                    ? "bg-gradient-to-r from-emerald-500 to-blue-500 text-white" 
                                                    : ""
                                            }`}
                                        >
                                            {pageNum}
                                        </Button>
                                    ))}
                                </div>

                                {/* Next Button */}
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => goToPage(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                    className="h-9 w-9 rounded-xl"
                                >
                                    <ChevronRight className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}