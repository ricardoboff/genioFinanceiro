
import React, { useState } from 'react';

interface Props {
  onRegister: (data: any) => void;
  onBack: () => void;
}

const Register: React.FC<Props> = ({ onRegister, onBack }) => {
  const [formData, setFormData] = useState({
    nome: '',
    telefone: '',
    username: '',
    password: ''
  });

  const validateAndSubmit = () => {
    if (!formData.nome || !formData.telefone || !formData.username || !formData.password) {
      alert("Todos os campos são obrigatórios.");
      return;
    }
    if (formData.password.length < 6) {
      alert("A senha deve ter pelo menos 6 caracteres.");
      return;
    }
    if (formData.telefone.replace(/\D/g, '').length < 10) {
      alert("Por favor, insira um número de WhatsApp válido com DDD.");
      return;
    }
    onRegister(formData);
  };

  return (
    <div className="flex flex-col h-screen bg-slate-50 p-8 overflow-y-auto">
      <button onClick={onBack} className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-slate-400 mb-8 shadow-sm">
        <i className="fa-solid fa-arrow-left"></i>
      </button>

      <h1 className="text-3xl font-black text-slate-800 mb-2">Crie sua conta</h1>
      <p className="text-slate-500 text-sm mb-8">Comece a gerenciar seu dinheiro como um gênio.</p>

      <div className="space-y-4">
        <Input label="Nome Completo" value={formData.nome} onChange={(v: string) => setFormData({...formData, nome: v})} />
        <Input label="WhatsApp (DDD + Número)" value={formData.telefone} onChange={(v: string) => setFormData({...formData, telefone: v})} type="tel" placeholder="69988776655" />
        <Input label="Nome de Usuário" value={formData.username} onChange={(v: string) => setFormData({...formData, username: v})} />
        <Input label="Senha de Acesso (Mín. 6 dígitos)" value={formData.password} onChange={(v: string) => setFormData({...formData, password: v})} type="password" />
      </div>

      <button 
        onClick={validateAndSubmit}
        className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold text-lg mt-8 shadow-lg shadow-indigo-100"
      >
        Finalizar Cadastro
      </button>
    </div>
  );
};

const Input = ({ label, value, onChange, type = "text", placeholder = "" }: any) => (
  <div>
    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2 px-1">{label}</label>
    <input 
      type={type} 
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full p-4 bg-white border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
    />
  </div>
);

export default Register;
