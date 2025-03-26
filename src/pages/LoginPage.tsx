
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { language } = useLanguage();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await login(email, password);
      
      if (error) throw error;
      
      toast({
        title: language === 'en' ? "Logged in successfully" : "Login realizado com sucesso",
      });
      navigate("/portal");
    } catch (error: any) {
      toast({
        title: language === 'en' ? "Authentication error" : "Erro de autenticação",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="flex items-center gap-2 mb-8 cursor-pointer" onClick={() => navigate("/")}>
        <img 
          src="https://via.placeholder.com/50?text=ANI" 
          alt="ANI Logo" 
          className="h-12 w-12 rounded" 
        />
        <h1 className="text-2xl font-bold">
          {language === 'en' ? 'ANI Data Portal' : 'Portal de Dados ANI'}
        </h1>
      </div>
      
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>
            {language === 'en' ? 'Login' : 'Entrar'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Input
                type="email"
                placeholder={language === 'en' ? 'Email' : 'E-mail'}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Input
                type="password"
                placeholder={language === 'en' ? 'Password' : 'Senha'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading
                ? (language === 'en' ? 'Loading...' : 'Carregando...')
                : (language === 'en' ? 'Login' : 'Entrar')}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
