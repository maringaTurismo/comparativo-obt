
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface AddRowModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (category: string, functionality: string) => void;
  categories: string[];
}

const AddRowModal: React.FC<AddRowModalProps> = ({ isOpen, onClose, onAdd, categories }) => {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [functionality, setFunctionality] = useState('');

  const handleSubmit = () => {
    if (selectedCategory && functionality.trim()) {
      onAdd(selectedCategory, functionality.trim());
      setSelectedCategory('');
      setFunctionality('');
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Adicionar Nova Funcionalidade</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="category">Categoria</Label>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma categoria" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="functionality">Nome da Funcionalidade</Label>
            <Input
              id="functionality"
              value={functionality}
              onChange={(e) => setFunctionality(e.target.value)}
              placeholder="Digite o nome da funcionalidade"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={!selectedCategory || !functionality.trim()}>
            Adicionar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddRowModal;
