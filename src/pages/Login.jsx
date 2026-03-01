import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { Mail, Lock, User, Users, ArrowRight, ShieldCheck, ArrowLeft, Eye, EyeOff, UserPlus } from 'lucide-react';
import './Login.css';

export default function Login() {
    const [isTeam, setIsTeam] = useState(false);
    const [isRegistering, setIsRegistering] = useState(false); // INYECTADO: Estado para alternar entre Login y Registro

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const [errorMsg, setErrorMsg] = useState('');
    const [successMsg, setSuccessMsg] = useState(''); // INYECTADO: Mensaje de éxito al registrarse

    const navigate = useNavigate();

    const handleAuth = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrorMsg('');
        setSuccessMsg('');

        try {
            if (isRegistering) {
                // FLUJO DE REGISTRO
                const { data, error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        data: {
                            is_team: isTeam // Guardamos si es taller o individual como metadato
                        }
                    }
                });

                if (error) {
                    setErrorMsg("Error al registrar: " + error.message);
                } else {
                    setSuccessMsg("¡Cuenta creada con éxito! Entrando al taller...");
                    // Si Supabase no requiere confirmación de email, el usuario ya estará logueado.
                    setTimeout(() => {
                        navigate('/dashboard');
                    }, 1500);
                }
            } else {
                // FLUJO DE INICIO DE SESIÓN
                const { data, error } = await supabase.auth.signInWithPassword({ email, password });

                if (error) {
                    console.error("Error Auth:", error.message);
                    setErrorMsg("Credenciales inválidas. Verifica tu correo y contraseña.");
                } else {
                    navigate('/dashboard');
                }
            }
        } catch (err) {
            setErrorMsg("Hubo un problema de conexión con el servidor. Intenta de nuevo.");
        } finally {
            setLoading(false);
        }
    };

    const toggleMode = () => {
        setIsRegistering(!isRegistering);
        setErrorMsg('');
        setSuccessMsg('');
    };

    return (
        <div className="login-wrapper">
            <button className="btn-back-home" onClick={() => navigate('/')}>
                <ArrowLeft size={18} /> Volver al Inicio
            </button>

            <div className="login-container glass-effect">
                <div className="login-header">
                    <div className="login-logo-circle">
                        <ShieldCheck size={32} color="white" />
                    </div>
                    <h2>Wepairr <span style={{ color: 'var(--accent-color)' }}>OS</span></h2>
                    <p>{isRegistering ? 'Crea tu espacio de trabajo (Beta)' : 'Sistema de Gestión para Servicios Técnicos'}</p>
                </div>

                <div className="login-type-toggle">
                    <button type="button" className={`toggle-btn ${!isTeam ? 'active' : ''}`} onClick={() => setIsTeam(false)}>
                        <User size={16} /> Individual
                    </button>
                    <button type="button" className={`toggle-btn ${isTeam ? 'active' : ''}`} onClick={() => setIsTeam(true)}>
                        <Users size={16} /> Taller / Equipo
                    </button>
                </div>

                <form onSubmit={handleAuth} className="login-form">

                    {errorMsg && (
                        <div className="login-error-msg animate-fade-in">
                            {errorMsg}
                        </div>
                    )}

                    {successMsg && (
                        <div className="login-success-msg animate-fade-in">
                            {successMsg}
                        </div>
                    )}

                    {isTeam && (
                        <div className="login-input-group animate-fade-in">
                            <label>ID del Taller (Nomenclatura)</label>
                            <div className="input-with-icon">
                                <Users size={18} className="input-icon" />
                                <input type="text" placeholder="Ej. TALLER-CENTRO" />
                            </div>
                        </div>
                    )}

                    <div className="login-input-group">
                        <label>Correo Electrónico</label>
                        <div className="input-with-icon">
                            <Mail size={18} className="input-icon" />
                            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="tecnico@taller.com" required />
                        </div>
                    </div>

                    <div className="login-input-group">
                        <label>Contraseña {isRegistering && "(Mínimo 6 caracteres)"}</label>
                        <div className="input-with-icon">
                            <Lock size={18} className="input-icon" />
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                                minLength={isRegistering ? 6 : undefined}
                            />
                            <button
                                type="button"
                                className="btn-toggle-password"
                                onClick={() => setShowPassword(!showPassword)}
                                title={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    <button type="submit" className="btn-login-submit" disabled={loading}>
                        {loading
                            ? (isRegistering ? 'Creando cuenta...' : 'Verificando Credenciales...')
                            : (isRegistering ? <><UserPlus size={18} /> Registrar Taller</> : <>Ingresar al Espacio de Trabajo <ArrowRight size={18} /></>)
                        }
                    </button>
                </form>

                <div className="login-footer">
                    {isRegistering ? (
                        <>¿Ya tienes una cuenta? <span onClick={toggleMode} className="toggle-mode-link">Inicia Sesión aquí</span></>
                    ) : (
                        <>¿No tienes un taller registrado? <span onClick={toggleMode} className="toggle-mode-link">Crea tu cuenta gratis</span></>
                    )}
                </div>
            </div>

            <div className="ambient-blob blob-1"></div>
            <div className="ambient-blob blob-2"></div>
        </div>
    );
}