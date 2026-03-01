import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { Mail, Lock, User, Users, ArrowRight, ShieldCheck, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import './Login.css';

export default function Login() {
    const [isTeam, setIsTeam] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrorMsg(''); // Resetea el error anterior

        // Conexión REAL a Supabase Auth
        try {
            const { data, error } = await supabase.auth.signInWithPassword({ email, password });

            if (error) {
                console.error("Error Auth:", error.message);
                // Si falla, mostramos el error y NO navegamos
                setErrorMsg("Credenciales inválidas. Verifica tu correo y contraseña.");
            } else {
                // Si es exitoso, entra al sistema
                navigate('/dashboard');
            }
        } catch (err) {
            setErrorMsg("Hubo un problema de conexión con el servidor. Intenta de nuevo.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-wrapper">
            {/* BOTÓN VOLVER AL HOME */}
            <button className="btn-back-home" onClick={() => navigate('/')}>
                <ArrowLeft size={18} /> Volver al Inicio
            </button>

            <div className="login-container glass-effect">
                <div className="login-header">
                    <div className="login-logo-circle">
                        <ShieldCheck size={32} color="white" />
                    </div>
                    <h2>Wepairr <span style={{ color: 'var(--accent-color)' }}>OS</span></h2>
                    <p>Sistema de Gestión para Servicios Técnicos</p>
                </div>

                <div className="login-type-toggle">
                    <button type="button" className={`toggle-btn ${!isTeam ? 'active' : ''}`} onClick={() => setIsTeam(false)}>
                        <User size={16} /> Individual
                    </button>
                    <button type="button" className={`toggle-btn ${isTeam ? 'active' : ''}`} onClick={() => setIsTeam(true)}>
                        <Users size={16} /> Taller / Equipo
                    </button>
                </div>

                <form onSubmit={handleLogin} className="login-form">

                    {/* CARTEL DE ERROR */}
                    {errorMsg && (
                        <div className="login-error-msg animate-fade-in">
                            {errorMsg}
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
                        <label>Contraseña</label>
                        <div className="input-with-icon">
                            <Lock size={18} className="input-icon" />
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                            />
                            {/* BOTÓN MOSTRAR/OCULTAR CONTRASEÑA */}
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
                        {loading ? 'Verificando Credenciales...' : <>Ingresar al Espacio de Trabajo <ArrowRight size={18} /></>}
                    </button>
                </form>

                <div className="login-footer">
                    ¿No tienes un taller registrado? <a href="#">Solicitar Beta Access</a>
                </div>
            </div>

            {/* Fondo decorativo animado (Efecto SaaS moderno) */}
            <div className="ambient-blob blob-1"></div>
            <div className="ambient-blob blob-2"></div>
        </div>
    );
}