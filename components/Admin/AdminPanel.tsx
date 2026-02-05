
import React, { useEffect, useState } from 'react';
import { storageService } from '../../services/storageService';
import { UserProfile } from '../../types';

const AdminPanel: React.FC = () => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    const data = await storageService.getAllProfiles();
    setUsers(data);
    setLoading(false);
  };

  return (
    <div className="pt-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-slate-800">Gestão de Usuários</h2>
        <button onClick={loadUsers} className="text-indigo-600 text-xs font-bold">Atualizar</button>
      </div>

      {loading ? (
        <div className="text-center py-10">Carregando usuários...</div>
      ) : (
        <div className="space-y-3">
          {users.map(u => (
            <div key={u.uid} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-slate-800">{u.nome}</p>
                <p className="text-[10px] text-slate-400">@{u.username} • {u.telefone}</p>
              </div>
              <div className="flex gap-2">
                {u.isAdmin && <span className="text-[8px] bg-indigo-600 text-white px-2 py-1 rounded-full font-bold uppercase">Admin</span>}
                <button 
                  onClick={() => {
                    const msg = `Senha: ${u.passwordDisplay}`;
                    window.open(`https://wa.me/55${u.telefone}?text=${msg}`, '_blank');
                  }}
                  className="w-8 h-8 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center"
                >
                  <i className="fa-brands fa-whatsapp"></i>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
