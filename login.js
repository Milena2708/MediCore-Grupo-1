// login.js - Módulo de Autenticación integrado con shared.js
document.addEventListener('DOMContentLoaded', () => {
    const formLogin = document.getElementById('form-login');
    const formRegistro = document.getElementById('form-registro');
    const supabase = window.supabaseClient;

    // --- INICIO DE SESIÓN ---
    if (formLogin) {
        formLogin.addEventListener('submit', async (e) => {
            e.preventDefault();
            const correo = document.getElementById('login-correo').value.trim();
            const contrasena = document.getElementById('login-password').value;

            try {
                const { data, error } = await supabase.auth.signInWithPassword({
                    email: correo,
                    password: contrasena
                });

                if (error) throw error;

                // Consultar el rol del usuario asignado en usuarios_perfil
                const { data: perfil, error: perfilError } = await supabase
                    .from('usuarios_perfil')
                    .select('rol')
                    .eq('user_id', data.user.id)
                    .single();

                if (perfilError || !perfil) throw new Error("El usuario no cuenta con un rol asignado.");

                // Guardar rol en sesión y redirigir
                sessionStorage.setItem('user_rol', perfil.rol);
                alert(`Ingreso correcto. Bienvenido, rol: ${perfil.rol}`);
                window.location.href = "index.html";
            } catch (err) {
                alert(`Error de ingreso: ${err.message}`);
            }
        });
    }

    // --- REGISTRO DE USUARIOS ---
    if (formRegistro) {
        formRegistro.addEventListener('submit', async (e) => {
            e.preventDefault();
            const nombre = document.getElementById('reg-nombre').value.trim();
            const correo = document.getElementById('reg-correo').value.trim();
            const contrasena = document.getElementById('reg-password').value;
            const confirmacion = document.getElementById('reg-confirm').value;
            const rol = document.getElementById('reg-rol').value;

            if (contrasena.length < 6) {
                alert("La contraseña debe tener un mínimo de 6 caracteres.");
                return;
            }
            if (contrasena !== confirmacion) {
                alert("Las contraseñas ingresadas no coinciden.");
                return;
            }
            if (!rol) {
                alert("Debe seleccionar un rol obligatorio para el sistema.");
                return;
            }

            try {
                const { data, error } = await supabase.auth.signUp({
                    email: correo,
                    password: contrasena
                });

                if (error) throw error;

                if (data.user) {
                    // Insertar en la tabla relacional usuarios_perfil
                    const { error: perfilError } = await supabase
                        .from('usuarios_perfil')
                        .insert([{
                            user_id: data.user.id,
                            nombre: nombre,
                            correo: correo,
                            rol: rol
                        }]);

                    if (perfilError) throw perfilError;
                    alert("Usuario registrado exitosamente. Ya puede iniciar sesión.");
                    formRegistro.reset();
                }
            } catch (err) {
                alert(`Error al registrar: ${err.message}`);
            }
        });
    }
});