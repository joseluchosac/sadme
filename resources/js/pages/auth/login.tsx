import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface LoginForm extends Record<string, any> {
  login: string; // username o email
  password: string;
  remember: boolean;
}

interface LoginProps {
  status?: string;
  canResetPassword: boolean;
  empresa: {
    nombre_comercial: string;
  }
}

export default function Login({ status, empresa, canResetPassword }: LoginProps) {
  const { data, setData, post, processing, errors, reset } = useForm<LoginForm>({
    login: '', // Cambiado 'email' por 'login'
    password: '',
    remember: false,
  });

  const submit: FormEventHandler = (e) => {
    e.preventDefault();
    post(route('login'), {
      onFinish: () => reset('password'),
    });
  };

  return (
    <AuthLayout title="Iniciar sesión" description="" nombre_comercial={empresa.nombre_comercial}>
      <Head title="Iniciar sesión" />
      <form className="flex flex-col gap-6" onSubmit={submit}>
        <div className="grid gap-6">
          <div className="grid gap-2">
            <Label htmlFor="login">Usuario</Label>
            <Input
              id="login"
              type="text"
              required
              autoFocus
              tabIndex={1}
              autoComplete="login"
              value={data.login}
              onChange={(e) => setData('login', e.target.value)}
            />
            <InputError message={errors.login} />
          </div>

          <div className="grid gap-2">
            <div className="flex items-center">
              <Label htmlFor="password">Contraseña</Label>
              {/* {canResetPassword && (
                                <TextLink href={route('password.request')} className="ml-auto text-sm" tabIndex={5}>
                                    Olvidaste tu password?
                                </TextLink>
                            )} */}
            </div>
            <Input
              id="password"
              type="password"
              required
              tabIndex={2}
              autoComplete="current-password"
              value={data.password}
              onChange={(e) => setData('password', e.target.value)}
            />
            <InputError message={errors.password} />
          </div>

          <div className="flex items-center space-x-3">
            <Checkbox
              id="remember"
              name="remember"
              tabIndex={3}
              checked={data.remember}
              onCheckedChange={(checked: boolean) => {
                setData('remember', checked)
              }}
            />
            <Label htmlFor="remember">Recordar sesión</Label>
          </div>

          <Button type="submit" className="mt-4 w-full" tabIndex={4} disabled={processing}>
            {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
            Iniciar sesión
          </Button>
        </div>
      </form>

      {status && <div className="mb-4 text-center text-sm font-medium text-green-600">{status}</div>}
    </AuthLayout>
  );
}
