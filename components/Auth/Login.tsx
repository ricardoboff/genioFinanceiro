
import React, { useState } from 'react';
import { storageService } from '../../services/storageService';

interface Props {
  onLogin: (user: string, pass: string) => void;
  onGoToRegister: () => void;
}

const Login: React.FC<Props> = ({ onLogin, onGoToRegister }) => {
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');

  const handleForgotPass = async () => {
    if (!user) {
      alert("Por favor, digite seu nome de usuário primeiro.");
      return;
    }
    const profile = await storageService.getProfileByUsername(user);
    if (!profile) {
      alert("Usuário não encontrado.");
      return;
    }

    const message = `Olá, sou do suporte Gênio Financeiro. Sua senha de acesso para o usuário @${profile.username} é: ${profile.passwordDisplay}`;
    const wpLink = `https://wa.me/55${profile.telefone.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
    window.open(wpLink, '_blank');
  };

  return (
    <div className="flex flex-col h-screen bg-indigo-600 p-8">
      <div className="flex-1 flex flex-col justify-center items-center text-white mb-12">
        <div className="w-20 h-20 bg-white/20 rounded-[2rem] flex items-center justify-center mb-6 backdrop-blur-md">
          <i className="fa-solid fa-coins text-4xl"></i>
        </div>
        <h1 className="text-3xl font-black mb-2">Gênio Financeiro</h1>
        <p className="text-indigo-100 text-sm opacity-80">Seu futuro começa com um clique.</p>
      </div>

      <div className="bg-white rounded-[2.5rem] p-8 shadow-2xl">
        <h2 className="text-xl font-bold text-slate-800 mb-6">Bem-vindo de volta!</h2>
        
        <div className="space-y-4">
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2 px-1">Usuário</label>
            <input 
              type="text" 
              value={user}
              onChange={e => setUser(e.target.value)}
              className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Digite seu usuário"
            />
          </div>
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2 px-1">Senha</label>
            <input 
              type="password" 
              value={pass}
              onChange={e => setPass(e.target.value)}
              className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="••••••••"
            />
          </div>
        </div>

        <button 
          onClick={() => onLogin(user, pass)}
          className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold text-lg mt-8 shadow-lg shadow-indigo-100"
        >
          Entrar
        </button>

        <div className="flex flex-col gap-4 mt-6 items-center">
          <button onClick={handleForgotPass} className="text-indigo-600 text-xs font-bold">Esqueci minha senha</button>
          <div className="flex gap-2 text-xs font-medium text-slate-400">
            Ainda não tem conta? 
            <button onClick={onGoToRegister} className="text-indigo-600 font-bold">Cadastre-se</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
