
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface AddColumnModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (obtKey: string, obtName: string) => void;
}

const AddColumnModal: React.FC<AddColumnModalProps> = ({ isOpen, onClose, onAdd }) => {
  const [obtKey, setObtKey] = useState('');
  const [obtName, setObtName] = useState('');

  const handleSubmit = () => {
    if (obtKey.trim() && obtName.trim()) {
      const key = obtKey.trim().toLowerCase().replace(/\s+/g, '');
      onAdd(key, obtName.trim());
      setObtKey('');
      setObtName('');
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Adicionar Novo OBT</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="obtName">Nome do OBT</Label>
            <Input
              id="obtName"
              value={obtName}
              onChange={(e) => setObtName(e.target.value)}
              placeholder="Ex: Novo Sistema"
            />
          </div>
          
          <div>
            <Label htmlFor="obtKey">Chave do OBT (identificador único)</Label>
            <Input
              id="obtKey"
              value={obtKey}
              onChange={(e) => setObtKey(e.target.value)}
              placeholder="Ex: novosistema"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={!obtKey.trim() || !obtName.trim()}>
            Adicionar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddColumnModal;
